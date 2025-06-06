import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';


import Home from "./pages/Home"
import Footer from './pages/Footer';
// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student Components
import StudentDashboard from './components/student/Dashboard';
import CourseList from './components/student/CourseList';
import StudentProfile from './components/student/Profile';

// Instructor Components
import InstructorDashboard from './components/instructor/Dashboard';

import NewCourse from './components/instructor/NewCourse';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import DepartmentList from './components/admin/DepartmentList';
import NewDepartment from './components/admin/NewDepartment';

// Shared Components
import Navbar from './components/shared/Navbar';
import PrivateRoute from './components/shared/PrivateRoute';
import NotFound from './components/shared/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />

        <div className="min-h-screen flex flex-col justify-between">
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <CourseList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute allowedRoles={["student", "instructor", "admin"]}>
                    <StudentProfile />
                  </PrivateRoute>
                }
              />

              {/* Instructor Routes */}
              <Route
                path="/instructor/dashboard"
                element={
                  <PrivateRoute allowedRoles={["instructor"]}>
                    <InstructorDashboard />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/instructor/courses/new"
                element={
                  <PrivateRoute allowedRoles={["instructor"]}>
                    <NewCourse />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <DepartmentList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/departments/new"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <NewDepartment />
                  </PrivateRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer at the bottom */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;