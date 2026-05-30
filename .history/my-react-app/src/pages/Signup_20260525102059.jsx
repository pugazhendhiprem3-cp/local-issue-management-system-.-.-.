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

    // 🟢 Password visibility state
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                'http://localhost:8080/api/auth/signup',
                formData
            );

            toast.success('Signup Successful!');

            navigate('/login');

        } catch (error) {

            toast.error('Signup Failed');
        }
    };

    return (

        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">

            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-lg shadow-md w-96 space-y-4"
            >

                <h2 className="text-2xl font-bold text-center">
                    Create Account
                </h2>

                {/* Full Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />

                {/* Password */}
                <div className="relative">

                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full p-2 pr-16 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>

                </div>

                {/* Phone Number */}
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => {

                        // 🟢 Allow only numbers
                        const onlyNums = e.target.value.replace(/\D/g, '');

                        // 🟢 Restrict to 10 digits
                        if (onlyNums.length <= 10) {
                            setFormData({
                                ...formData,
                                phoneNumber: onlyNums
                            });
                        }
                    }}
                    required
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition duration-200"
                >
                    Sign Up
                </button>

            </form>

        </div>
    );
};

export default Signup;