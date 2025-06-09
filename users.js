const express = require("express")
const { pool } = require("../config/database")
const { authenticateToken, checkUserExists } = require("../middleware/auth")

const router = express.Router()

// Get user profile
router.get("/profile", authenticateToken, checkUserExists, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, role, first_name, last_name, phone, address, emergency_contact, 
              student_id, department, year, semester, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    // Send the user data in snake_case format
    res.json(rows[0])
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({ error: "Database error" })
  }
})

// Update user profile
router.put("/profile", authenticateToken, checkUserExists, async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { firstName, lastName, phone, address, emergencyContact, department, year, semester } = req.body

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "First name and last name are required" })
    }

    await connection.beginTransaction()

    await connection.execute(
      `UPDATE users SET 
        first_name = ?, 
        last_name = ?, 
        phone = ?, 
        address = ?, 
        emergency_contact = ?,
        department = ?,
        year = ?,
        semester = ?
       WHERE id = ?`,
      [firstName, lastName, phone, address, emergencyContact, department, year, semester, req.user.id]
    )

    // Fetch updated user data
    const [updatedUser] = await connection.execute(
      `SELECT id, email, role, first_name, last_name, phone, address, emergency_contact, 
              student_id, department, year, semester, created_at 
       FROM users WHERE id = ?`,
      [req.user.id]
    )

    await connection.commit()
    
    // Send the updated user data in snake_case format
    res.json(updatedUser[0])
  } catch (error) {
    await connection.rollback()
    console.error("Error updating profile:", error)
    res.status(500).json({ error: "Failed to update profile" })
  } finally {
    connection.release()
  }
})

module.exports = router
