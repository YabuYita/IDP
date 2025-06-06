import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get('/api/courses/enrolled');
        setEnrolledCourses(res.data);
      } catch (error) {
        toast.error('Failed to load enrolled courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <Link 
          to="/courses" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Browse Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Enrolled Courses</h3>
          <p className="text-2xl font-bold">{enrolledCourses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Credits</h3>
          <p className="text-2xl font-bold">{totalCredits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Semester</h3>
          <p className="text-2xl font-bold">Spring 2024</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="text-2xl font-bold">Active</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Enrolled Courses</h2>
        
        {isLoading ? (
          <p className="text-center py-4">Loading courses...</p>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.credits} Credits
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Instructor:</span> {course.instructor}
                </p>
                <button 
                  onClick={() => toast.info('Course details feature coming soon!')}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link 
              to="/courses" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Browse Available Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;