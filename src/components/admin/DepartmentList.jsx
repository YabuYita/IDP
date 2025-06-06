import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // In a real application, you would have an API endpoint for this
        // This is a mock implementation
        const res = await axios.get('/api/admin/departments');
        setDepartments(res.data);
      } catch (error) {
        toast.error('Failed to load departments');
        // Set some mock data for demonstration
        setDepartments([
          {
            id: 1,
            name: 'Computer Science',
            code: 'CS',
            description: 'Department of Computer Science and Engineering',
            coursesCount: 8
          },
          {
            id: 2,
            name: 'Mathematics',
            code: 'MATH',
            description: 'Department of Mathematics',
            coursesCount: 6
          },
          {
            id: 3,
            name: 'English',
            code: 'ENG',
            description: 'Department of English',
            coursesCount: 4
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/departments/${id}`);
      setDepartments(departments.filter(dept => dept.id !== id));
      toast.success('Department deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(
    dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Departments</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search departments..."
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link 
            to="/admin/departments/new" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Department
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading departments...</p>
        </div>
      ) : filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map(department => (
            <div key={department.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{department.name}</h3>
                    <p className="text-sm text-gray-500">{department.code}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {department.coursesCount} Courses
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{department.description}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Link 
                    to={`/admin/departments/${department.id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(department.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No departments found matching your search criteria.</p>
          <Link 
            to="/admin/departments/new" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Department
          </Link>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;