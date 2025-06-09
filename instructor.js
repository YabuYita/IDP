const express = require("express")
const { pool } = require("../config/database")
const { authenticateToken, authorizeRole, checkUserExists } = require("../middleware/auth")

const router = express.Router()

// Get instructor's courses
router.get("/courses", authenticateToken, checkUserExists, authorizeRole(["instructor"]), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.*, COUNT(e.id) as enrolled_count
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
       WHERE c.instructor_id = ?
       GROUP BY c.id
       ORDER BY c.course_code`,
      [req.user.id],
    )

    res.json(rows)
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    res.status(500).json({ error: "Database error" })
  }
})

// Create new course (instructors only)
router.post("/courses", authenticateToken, checkUserExists, authorizeRole(["instructor"]), async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { code, title, credits, description, prerequisites, syllabus } = req.body

    if (!code || !title || !description) {
      return res.status(400).json({ error: "Course code, title, and description are required" })
    }

    await connection.beginTransaction()

    const [result] = await connection.execute(
      `INSERT INTO courses (course_code, course_name, credits, description, prerequisites, syllabus, instructor_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code, title, credits, description, prerequisites, syllabus, req.user.id],
    )

    await connection.commit()
    res.status(201).json({ message: "Course created successfully", courseId: result.insertId })
  } catch (error) {
    await connection.rollback()
    console.error("Error creating course:", error)

    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Course code already exists" })
    } else {
      res.status(500).json({ error: "Failed to create course" })
    }
  } finally {
    connection.release()
  }
})

// Get students enrolled in instructor's course
router.get("/courses/:id/students", authenticateToken, checkUserExists, authorizeRole(["instructor"]), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.first_name, u.last_name, u.email, e.enrollment_date, e.status
       FROM enrollments e
       JOIN users u ON e.student_id = u.id
       JOIN courses c ON e.course_id = c.id
       WHERE c.id = ? AND c.instructor_id = ?
       ORDER BY u.last_name, u.first_name`,
      [req.params.id, req.user.id],
    )

    res.json(rows)
  } catch (error) {
    console.error("Error fetching course students:", error)
    res.status(500).json({ error: "Database error" })
  }
})

module.exports = router
