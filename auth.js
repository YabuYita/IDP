const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { pool } = require("../config/database")

const router = express.Router()

// Register endpoint
router.post("/register", async (req, res) => {
  const connection = await pool.getConnection()

  try {
    const { email, password, firstName, lastName, role = "student", phone, address, emergencyContact } = req.body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    await connection.beginTransaction()

    // Check if user already exists
    const [existingUsers] = await connection.execute("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      await connection.rollback()
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert user
    const [result] = await connection.execute(
      `INSERT INTO users (email, password, role, first_name, last_name, phone, address, emergency_contact) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, role, firstName, lastName, phone, address, emergencyContact],
    )

    await connection.commit()

    // Generate JWT token
    const token = jwt.sign({ id: result.insertId, email, role }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertId,
        email,
        role,
        firstName,
        lastName,
      },
    })
  } catch (error) {
    await connection.rollback()
    console.error("Registration error:", error)

    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "User already exists" })
    } else {
      res.status(500).json({ error: "Failed to create user" })
    }
  } finally {
    connection.release()
  }
})

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Get user from database
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const user = rows[0]

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

module.exports = router
