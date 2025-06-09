const express = require("express")
const { pool } = require("../config/database")
const { authenticateToken, authorizeRole, checkUserExists } = require("../middleware/auth")

const   router = express.Router()

// Get all courses
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, 
             CONCAT(u.first_name, ' ', u.last_name) as instructor_name,
             COUNT(e.id) as enrolled_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
      GROUP BY c.id
      ORDER BY c.course_code
    `)

    res.json(rows)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ error: "Database error" })
  }
})

// Get course by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT c.*, 
             CONCAT(u.first_name, ' ', u.last_name) as instructor_name,
             COUNT(e.id) as enrolled_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'enrolled'
      WHERE c.id = ?
      GROUP BY c.id
    `,
      [req.params.id],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: "Course not found" })
    }

    res.json(rows[0])
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({ error: "Database error" })
  }
})

// Create new course (instructors and admins only)
router.post("/", authenticateToken, checkUserExists, authorizeRole(["instructor", "admin"]), async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { courseCode, courseName, description, syllabus, prerequisites, maxStudents = 30 } = req.body

    if (!courseCode || !courseName || !description) {
      return res.status(400).json({ error: "Course code, name, and description are required" })
    }

    await connection.beginTransaction()

    const [result] = await connection.execute(
      `INSERT INTO courses (course_code, course_name, description, syllabus, prerequisites, instructor_id, max_students) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [courseCode, courseName, description, syllabus, prerequisites, req.user.id, maxStudents],
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

// Update course (instructors and admins only)
router.put("/:id", authenticateToken, checkUserExists, authorizeRole(["instructor", "admin"]), async (req, res) => {
  const connection = await pool.getConnection()

  try { 
    const { courseName, description, syllabus, prerequisites, maxStudents } = req.body

    if (!courseName || !description) {
      return res.status(400).json({ error: "Course name and description are required" })
    }

    await connection.beginTransaction()

    // Check if course exists and user has permission
    const whereClause = req.user.role === "admin" ? "WHERE id = ?" : "WHERE id = ? AND instructor_id = ?"
    const params = req.user.role === "admin" ? [req.params.id] : [req.params.id, req.user.id]

    const [result] = await connection.execute(
      `UPDATE courses SET course_name = ?, description = ?, syllabus = ?, prerequisites = ?, max_students = ? 
       ${whereClause}`,
      [courseName, description, syllabus, prerequisites, maxStudents, ...params],
    )

    if (result.affectedRows === 0) {
      await connection.rollback()
      return res.status(404).json({ error: "Course not found or unauthorized" })
    }

    await connection.commit()
    res.json({ message: "Course updated successfully" })
  } catch (error) {
    await connection.rollback()
    console.error("Error updating course:", error)
    res.status(500).json({ error: "Failed to update course" })
  } finally {
    connection.release()
  }
})

// Delete course (admins only)
router.delete("/:id", authenticateToken, checkUserExists, authorizeRole(["admin"]), async (req, res) => {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Check if course exists
    const [courseRows] = await connection.execute("SELECT id FROM courses WHERE id = ?", [req.params.id])

    if (courseRows.length === 0) {
      await connection.rollback()
      return res.status(404).json({ error: "Course not found" })
    }

    // Delete enrollments first (due to foreign key constraint)
    await connection.execute("DELETE FROM enrollments WHERE course_id = ?", [req.params.id])

    // Delete course
    await connection.execute("DELETE FROM courses WHERE id = ?", [req.params.id])

    await connection.commit()
    res.json({ message: "Course deleted successfully" })
  } catch (error) {
    await connection.rollback()
    console.error("Error deleting course:", error)
    res.status(500).json({ error: "Failed to delete course" })
  } finally {
    connection.release()
  }
})

module.exports = router
