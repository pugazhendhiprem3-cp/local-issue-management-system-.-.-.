import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 🟢 Added for redirecting after login

const Login = () => {
    // 1. Define states to hold the user inputs
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate(); // 🟢 Hook to redirect the user to another page

    // 2. Handle updating state when a user types in inputs
    const handleChange = (e) => {
        setFormData({ ...loginData, [e.target.name]: e.target.value });
    };

    // 3. 🟢 THIS IS YOUR STEP 2 CODE integrated here:
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sends request to your Spring Boot Backend UserService endpoint
            const response = await axios.post('http://localhost:8080/api/users/login', loginData);
            
            // Destructure token and role from backend Response DTO
            const { token, role } = response.data;

            // Store token and role safely in the user's browser storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            alert('Login Successful!');
            
            // Redirect user to the Issues Feed / Home screen
            navigate('/'); 
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid credentials');
        }
    };

    // 4. Bind the function to the HTML form's onSubmit attribute
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <form onSubmit={handleLoginSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500" 
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition duration-200"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;