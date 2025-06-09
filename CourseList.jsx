import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available courses
        const coursesRes = await axios.get('/api/courses');
        setCourses(coursesRes.data);
        
        // Fetch enrolled courses to know which ones the student is already enrolled in
        const enrolledRes = await axios.get('/api/courses/enrolled');
        setEnrolledCourseIds(enrolledRes.data.map(course => course.id));
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/api/courses/enroll', { courseId });
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      toast.success('Successfully enrolled in course');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await axios.post('/api/courses/unenroll', { courseId });
      setEnrolledCourseIds(enrolledCourseIds.filter(id => id !== courseId));
      toast.success('Successfully unenrolled from course');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unenroll from course');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search courses..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            
            return (
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
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{course.description}</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Instructor:</span> {course.instructor}
                  </p>
                </div>
                <div className="px-6 py-3 bg-gray-50">
                  <button
                    onClick={() => isEnrolled ? handleUnenroll(course.id) : handleEnroll(course.id)}
                    className={`w-full py-2 px-4 rounded font-medium ${
                      isEnrolled 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isEnrolled ? 'Drop Course' : 'Enroll'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No courses found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;