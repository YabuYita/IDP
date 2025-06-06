import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/instructor/courses');
        setCourses(res.data);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <Link 
          to="/instructor/courses/new" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
          <p className="text-2xl font-bold">{courses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{totalStudents}</p>
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

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Courses</h2>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading courses...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.credits} Credits
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                <div className="mt-4 text-sm">
                  <span className="font-medium">{course.enrolledStudents}</span> students enrolled
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <Link 
                  to={`/instructor/courses/${course.id}`}
                  className="block w-full text-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
                >
                  Manage Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">You don't have any courses yet.</p>
          <Link 
            to="/instructor/courses/new" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;