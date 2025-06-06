import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalDepartments: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would have an API endpoint for this
        // This is a mock implementation
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        // Set some mock data for demonstration
        setStats({
          totalStudents: 120,
          totalInstructors: 15,
          totalCourses: 25,
          totalDepartments: 5
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Total Instructors</h3>
              <p className="text-2xl font-bold">{stats.totalInstructors}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
              <p className="text-2xl font-bold">{stats.totalCourses}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Total Departments</h3>
              <p className="text-2xl font-bold">{stats.totalDepartments}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Management</h2>
                <Link 
                  to="/admin/users" 
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                <Link 
                  to="/admin/users/students"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Manage Students
                </Link>
                <Link 
                  to="/admin/users/instructors"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Manage Instructors
                </Link>
                <Link 
                  to="/admin/users/new"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Add New User
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Department Management</h2>
                <Link 
                  to="/admin/departments" 
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                <Link 
                  to="/admin/departments"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  View Departments
                </Link>
                <Link 
                  to="/admin/departments/new"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Add New Department
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Course Management</h2>
                <Link 
                  to="/admin/courses" 
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                <Link 
                  to="/admin/courses"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  View All Courses
                </Link>
                <Link 
                  to="/admin/courses/new"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Add New Course
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">System Settings</h2>
                <Link 
                  to="/admin/settings" 
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View
                </Link>
              </div>
              <div className="space-y-2">
                <Link 
                  to="/admin/settings/general"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  General Settings
                </Link>
                <Link 
                  to="/admin/settings/academic"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Academic Calendar
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;