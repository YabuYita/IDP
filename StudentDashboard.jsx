import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/students/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStudent(response.data);
      } catch (error) {
        setError('Failed to load student data');
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/student/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {student?.first_name} {student?.last_name}!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Student ID</h3>
              <p className="text-blue-700">{student?.student_id}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Department</h3>
              <p className="text-green-700">{student?.department?.name}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Year & Semester</h3>
              <p className="text-purple-700">Year {student?.year}, Semester {student?.semester}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/student/courses"
              className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h4 className="text-lg font-semibold text-indigo-900">My Courses</h4>
              <p className="text-indigo-700">View enrolled courses</p>
            </Link>
            <Link
              to="/student/grades"
              className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <h4 className="text-lg font-semibold text-yellow-900">Grades</h4>
              <p className="text-yellow-700">Check your grades</p>
            </Link>
            <Link
              to="/student/schedule"
              className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h4 className="text-lg font-semibold text-green-900">Schedule</h4>
              <p className="text-green-700">View class schedule</p>
            </Link>
            <Link
              to="/student/profile"
              className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h4 className="text-lg font-semibold text-purple-900">Profile</h4>
              <p className="text-purple-700">Update your information</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard; 