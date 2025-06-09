const jwt = require("jsonwebtoken")
const { pool } = require("../config/database")

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }
    next()
  }
}

// Check if user exists and is active
const checkUserExists = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT id, role FROM users WHERE id = ?", [req.user.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    req.user.role = rows[0].role // Update role in case it changed
    next()
  } catch (error) {
    console.error("Error checking user:", error)
    res.status(500).json({ error: "Database error" })
  }
}

module.exports = {
  authenticateToken,
  authorizeRole,
  checkUserExists,
}
