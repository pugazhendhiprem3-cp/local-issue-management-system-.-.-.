import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    if (imageFile) {
      data.append('image', imageFile);
    }

    // 🟢 Grab token from storage where your login feature saved it
    const token = localStorage.getItem('token'); 

    try {
      //  WHAT YOU SHOULD HAVE (Safe from crashing):
const response = await axios.post("http://localhost:8080/issues", formData);

// Use response.data.createdByName or optional chaining (?.) so it falls back gracefully
const creatorName = response.data.createdByName || "Anonymous";
alert(`Issue created successfully by ${creatorName}`);

      setMessage({ type: 'success', text: '🎉 Issue reported successfully!' });
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Unauthorized or failed backend connection.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-950 p-8 rounded-xl border border-slate-800 shadow-2xl mt-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-6 border-b border-slate-800 pb-3">
        ➕ Report a Local Issue
      </h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 text-sm border ${
          message.type === 'success' 
            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' 
            : 'bg-rose-950/50 text-rose-400 border-rose-800/50'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Issue Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Deep pothole near main crossroad"
            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="Pothole">🕳️ Pothole</option>
            <option value="Streetlight">💡 Broken Streetlight</option>
            <option value="Garbage">🗑️ Garbage Accumulation</option>
            <option value="Water Leak">💧 Water Leakage</option>
            <option value="Other">⚠️ Other Issue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Location Address</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., 4th Block, Sector 2"
            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Description Details</label>
          <textarea
            name="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief explanation about the issue severity..."
            className="w-full bg-slate-900 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Upload Photo Evidence</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold py-2.5 rounded transition duration-200 mt-2"
        >
          {loading ? 'Submitting Report...' : '🚀 Submit Issue Report'}
        </button>
      </form>
    </div>
  );
};

export default CreateIssue;