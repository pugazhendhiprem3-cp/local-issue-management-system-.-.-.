import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', formData);
            toast.success('Signup Successful!');
            navigate('/login');
        } catch (error) {
            toast.error('Signup Failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center">Create Account</h2>
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
                <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" />
                
                

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition duration-200">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;