import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { currentUser, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    emergency_contact: '',
    gender: '',
    date_of_birth: '',
    year: '',
    semester: '',
    department_id: ''
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.emergency_contact?.trim()) {
      newErrors.emergency_contact = 'Emergency contact is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }
    
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student profile
        const profileRes = await axios.get('/api/students/profile');
        const profileData = profileRes.data;
        
        // Format date_of_birth to yyyy-MM-dd
        if (profileData.date_of_birth) {
          profileData.date_of_birth = new Date(profileData.date_of_birth).toISOString().split('T')[0];
        }
        
        setFormData(profileData);

        // Fetch departments
        const deptRes = await axios.get('/api/auth/departments');
        setDepartments(deptRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSaving(true);
    try {
      console.log("Sending profile update with data:", formData);
      console.log("Auth header:", axios.defaults.headers.common['Authorization']);
      
      const response = await axios.put('/api/students/profile', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log("Profile update response:", response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-8">
      <div className="max-w-3xl mx-auto bg-white/95 shadow-xl rounded-2xl px-8 pt-8 pb-10 border border-gray-200">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-800 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                id="email"
                type="email"
                value={currentUser.email || ''}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="emergency_contact">
                  Emergency Contact
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="emergency_contact"
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address">
                Address
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="gender">
                  Gender
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="date_of_birth">
                  Date of Birth
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="date_of_birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.department_id ? 'border-red-500' : ''
                  }`}
                  disabled={!isEditing}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.department_id}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="year">
                  Year
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select year</option>
                  {[1, 2, 3, 4, 5].map(year => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="semester">
                  Semester
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline transition-all"
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="">Select semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium text-gray-900">{formData.first_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium text-gray-900">{formData.last_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-900">{formData.student_id || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize text-gray-900">{formData.gender || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{formData.date_of_birth || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">
                    {formData.department_name ? `${formData.department_name} (${formData.department_code})` : 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year & Semester</p>
                  <p className="font-medium text-gray-900">
                    {formData.year && formData.semester 
                      ? `Year ${formData.year}, Semester ${formData.semester}`
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="font-medium text-gray-900">{formData.emergency_contact || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Address</h3>
              <p className="font-medium text-gray-900">{formData.address || 'Not provided'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;