const express = require("express")
const { pool } = require("../config/database")
const { authenticateToken, authorizeRole, checkUserExists } = require("../middleware/auth")

const router = express.Router()

// Enroll in course (students only)
router.post("/", authenticateToken, checkUserExists, authorizeRole(["student"]), async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" })
    }

    await connection.beginTransaction()

    // Check if already enrolled
    const [existingEnrollment] = await connection.execute(
      "SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND status = 'enrolled'",
      [req.user.id, courseId],
    )

    if (existingEnrollment.length > 0) {
      await connection.rollback()
      return res.status(400).json({ error: "Already enrolled in this course" })
    }

    // Check course capacity
    const [courseInfo] = await connection.execute(
      `SELECT c.max_students, COUNT(e.id) as enrolled_count
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
       WHERE c.id = ?
       GROUP BY c.id`,
      [courseId],
    )

    if (courseInfo.length === 0) {
      await connection.rollback()
      return res.status(404).json({ error: "Course not found" })
    }

    if (courseInfo[0].enrolled_count >= courseInfo[0].max_students) {
      await connection.rollback()
      return res.status(400).json({ error: "Course is full" })
    }

    // Enroll student
    await connection.execute("INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)", [req.user.id, courseId])

    await connection.commit()
    res.status(201).json({ message: "Enrolled successfully" })
  } catch (error) {
    await connection.rollback()
    console.error("Error enrolling in course:", error)
    res.status(500).json({ error: "" })
  } finally {
    connection.release()
  }
})

// Get student's enrollments
router.get("/", authenticateToken, checkUserExists, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, c.course_code, c.course_name, c.description,
              CONCAT(u.first_name, ' ', u.last_name) as instructor_name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN users u ON c.instructor_id = u.id
       WHERE e.student_id = ? AND e.status = 'enrolled'
       ORDER BY e.enrollment_date DESC`,
      [req.user.id],
    )

    res.json(rows)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    res.status(500).json({ error: "Database error" })
  }
})

// Unenroll from course (students only)
router.delete("/:courseId", authenticateToken, checkUserExists, authorizeRole(["student"]), async (req, res) => {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [result] = await connection.execute(
      "UPDATE enrollments SET status = 'dropped' WHERE student_id = ? AND course_id = ? AND status = 'enrolled'",
      [req.user.id, req.params.courseId],
    )

    if (result.affectedRows === 0) {
      await connection.rollback()
      return res.status(404).json({ error: "Enrollment not found" })
    }

    await connection.commit()
    res.json({ message: "Unenrolled successfully" })
  } catch (error) {
    await connection.rollback()
    console.error("Error unenrolling from course:", error)
    res.status(500).json({ error: "Failed to unenroll" })
  } finally {
    connection.release()
  }
})

module.exports = router
