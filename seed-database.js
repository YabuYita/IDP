const mysql = require("mysql2/promise")
const bcrypt = require("bcrypt")
require("dotenv").config()

async function seedDatabase() {
  let connection

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "student_registration",
    })

    console.log("Connected to MySQL database")

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10)
    const instructorPassword = await bcrypt.hash("instructor123", 10)

    // Insert sample admin user
    await connection.execute(
      `INSERT IGNORE INTO users (email, password, role, first_name, last_name) 
       VALUES (?, ?, 'admin', 'System', 'Admin')`,
      ["admin@school.edu", adminPassword],
    )

    // Insert sample instructor
    await connection.execute(
      `INSERT IGNORE INTO users (email, password, role, first_name, last_name, phone) 
       VALUES (?, ?, 'instructor', 'John', 'Doe', '555-0123')`,
      ["john.doe@school.edu", instructorPassword],
    )

    // Get instructor ID
    const [instructorRows] = await connection.execute("SELECT id FROM users WHERE email = ?", ["john.doe@school.edu"])
    const instructorId = instructorRows[0]?.id || 2

    // Insert sample courses
    const courses = [
      [
        "CS101",
        "Introduction to Computer Science",
        "Basic programming concepts and problem solving",
        "Week 1: Variables\nWeek 2: Loops\nWeek 3: Functions\nWeek 4: Arrays\nWeek 5: Objects",
        "None",
        instructorId,
      ],
      [
        "MATH201",
        "Calculus I",
        "Differential and integral calculus",
        "Week 1: Limits\nWeek 2: Derivatives\nWeek 3: Applications of Derivatives\nWeek 4: Integrals\nWeek 5: Applications of Integrals",
        "High School Algebra",
        instructorId,
      ],
      [
        "ENG101",
        "English Composition",
        "Writing and communication skills",
        "Week 1: Essay Structure\nWeek 2: Research Methods\nWeek 3: Citations\nWeek 4: Presentations\nWeek 5: Final Project",
        "None",
        instructorId,
      ],
      [
        "PHYS101",
        "General Physics I",
        "Mechanics and thermodynamics",
        "Week 1: Kinematics\nWeek 2: Forces\nWeek 3: Energy\nWeek 4: Momentum\nWeek 5: Thermodynamics",
        "Calculus I",
        instructorId,
      ],
    ]

    for (const course of courses) {
      await connection.execute(
        `INSERT IGNORE INTO courses (course_code, course_name, description, syllabus, prerequisites, instructor_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        course,
      )
    }

    console.log("Database seeded successfully!")
    console.log("Demo credentials:")
    console.log("Admin: admin@school.edu / admin123")
    console.log("Instructor: john.doe@school.edu / instructor123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

seedDatabase()
