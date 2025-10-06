import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios for production and development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? `${window.location.origin}/api` 
  : 'http://localhost:5000/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Making API request to:', request.url);
  console.log('Full URL:', request.baseURL + request.url);
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('API response received:', response.status);
    return response;
  },
  error => {
    console.error('API error:', error.message);
    console.error('Error details:', error.response?.data || error);
    return Promise.reject(error);
  }
);

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    marks: ''
  });

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching students...');
      const response = await api.get('/students');
      console.log('Students response:', response.data);
      
      if (response.data.success) {
        setStudents(response.data.data);
        setConnectionStatus('Connected ✅');
      } else {
        setError('Failed to fetch students');
        setConnectionStatus('API Error ❌');
      }
    } catch (err) {
      console.error('Fetch students error:', err);
      setError(`Error: ${err.response?.data?.message || err.message || 'Connection failed'}`);
      setConnectionStatus('Connection Failed ❌');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.branch || !formData.marks) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/students', {
        ...formData,
        marks: parseInt(formData.marks)
      });

      if (response.data.success) {
        setSuccess('Student added successfully!');
        setFormData({ name: '', email: '', branch: '', marks: '' });
        fetchStudents(); // Refresh the list
      } else {
        setError(response.data.message || 'Failed to add student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding student');
      console.error('Error adding student:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const testConnection = async () => {
    setConnectionStatus('Testing...');
    setError('');
    setSuccess('');
    
    try {
      console.log('Testing API connection...');
      const response = await api.get('/health');
      console.log('Health check response:', response.data);
      
      if (response.data.status === 'OK') {
        setSuccess('API connection successful!');
        setConnectionStatus('Connected ✅');
        setError('');
      } else {
        setError('API health check failed');
        setConnectionStatus('Health Check Failed ❌');
      }
    } catch (err) {
      console.error('Connection test error:', err);
      setError(`Connection test failed: ${err.message}`);
      setConnectionStatus('Connection Failed ❌');
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Calculate statistics
  const stats = {
    total: students.length,
    avgMarks: students.length > 0 
      ? (students.reduce((sum, student) => sum + student.marks, 0) / students.length).toFixed(1)
      : 0,
    highestMarks: students.length > 0 
      ? Math.max(...students.map(s => s.marks))
      : 0
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎓 MERN Stack Student Management</h1>
        <p>Deployed on Vercel with MongoDB Atlas</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn" onClick={testConnection}>
            Test API Connection
          </button>
          <span style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', fontSize: '0.9rem' }}>
            Status: {connectionStatus}
          </span>
        </div>
        <div style={{ marginTop: '5px', fontSize: '0.8rem', opacity: 0.8 }}>
          API URL: {API_BASE_URL}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Statistics */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.avgMarks}</div>
          <div className="stat-label">Average Marks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.highestMarks}</div>
          <div className="stat-label">Highest Marks</div>
        </div>
      </div>

      {/* Add Student Form */}
      <div className="card">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="branch">Branch/Department</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science, Mechanical"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="marks">Marks</label>
            <input
              type="number"
              id="marks"
              name="marks"
              value={formData.marks}
              onChange={handleInputChange}
              placeholder="Enter marks (0-100)"
              min="0"
              max="100"
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adding Student...' : 'Add Student'}
          </button>
        </form>
      </div>

      {/* Students List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Students List</h2>
          <button className="btn" onClick={fetchStudents} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading && <div className="loading">Loading students...</div>}

        {!loading && students.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No students found. Add your first student above!
          </p>
        )}

        <div className="students-grid">
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <h3>{student.name}</h3>
              <div className="student-info">
                <span><strong>Email:</strong> {student.email}</span>
                <span><strong>Branch:</strong> {student.branch}</span>
                <span><strong>Marks:</strong> {student.marks}/100</span>
                <span><strong>Added:</strong> {new Date(student.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px', color: 'white', opacity: 0.8 }}>
        <p>MERN Stack Application • MongoDB + Express.js + React.js + Node.js</p>
        <p>Deployed on Vercel Platform</p>
      </div>
    </div>
  );
}

export default App;