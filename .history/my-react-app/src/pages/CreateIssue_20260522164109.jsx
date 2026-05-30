import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateIssue = () => {
  const navigate = useNavigate();

  // Form State Values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Status State Values
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle image input selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Submit Form Content to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Packaging content inside FormData format for Multipart file processing
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('category', category);
    
    if (imageFile) {
      // Must explicitly match your Spring Boot parameter name: @RequestParam("file")
      formData.append('file', imageFile); 
    }

    try {
      // Pulling your authentication session token out of storage
      const token = localStorage.getItem('token'); 

      if (!token) {
        throw new Error("Authentication token missing. Please sign in to report issues.");
      }

      // Posting data structure to backend server
      await axios.post('http://localhost:8080/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Clears the 403 authorization lock!
        }
      });

      setMessage('🎉 Issue reported successfully!');
      
      // Auto-redirect to layout view dashboard after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error("Submission Failure:", error);
      const errorMsg = error.response?.data?.message || error.message || 'Submission failed.';
      setMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">🚨 Report a Local Issue</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded text-sm font-semibold ${message.startsWith('🎉') ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/40 text-rose-300'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Issue Title</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Damaged Pothole, Broken Street Light"
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Category</label>
          <input 
            type="text" 
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Roads, Sanitation, Utilities"
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Location / Neighborhood</label>
          <input 
            type="text" 
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Main Street, Ward 4"
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Detailed Description</label>
          <textarea 
            rows="4"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide explicit details regarding the issue..."
            className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Upload Image Evidence</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Submitting Report...' : 'Submit Issue Report'}
        </button>
      </form>
    </div>
  );
};

// 🟢 CRUCIAL FIX: Default export matches your exact App.jsx lookup call
export default CreateIssue;