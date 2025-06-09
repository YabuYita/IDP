import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { currentUser, loading } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    if (loading) return; // Wait for AuthContext to finish loading

    const fetchData = async () => {
      try {
        console.log("Auth header:", axios.defaults.headers.common['Authorization']);
        // Fetch student profile
        const profileRes = await axios.get('/api/students/profile');
        setStudentInfo(profileRes.data);

        // Fetch enrolled courses
        const coursesRes = await axios.get('/api/enrollments');
        setEnrolledCourses(coursesRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loading]);

  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credits, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {studentInfo?.first_name} {studentInfo?.last_name}!
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Student ID</p>
              <p className="text-lg font-semibold text-blue-900">{studentInfo?.student_id}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Department</p>
              <p className="text-lg font-semibold text-green-900">
                {studentInfo?.department_name} ({studentInfo?.department_code})
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Year & Semester</p>
              <p className="text-lg font-semibold text-purple-900">
                Year {studentInfo?.year}, Semester {studentInfo?.semester}
              </p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Enrolled Courses</h2>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Browse Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No courses enrolled yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.course_code}</p>
                  <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Credits: {course.credits}
                    </span>
                    <span className="text-sm text-gray-500">
                      Status: {course.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;