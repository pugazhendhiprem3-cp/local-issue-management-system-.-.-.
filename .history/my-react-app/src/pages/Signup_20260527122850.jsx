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

            await axios.post(
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

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-100 px-4">

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-8">

                {/* LOGO / TITLE */}
                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg">
                        🚨
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-800 mt-5">
                        Create Account
                    </h2>

                    <p className="text-slate-500 mt-2 text-sm">
                        Join UrbanVoice and report local issues instantly
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* FULL NAME */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 transition"
                        />

                    </div>

                    {/* EMAIL */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 transition"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Create a password"
                                onChange={handleChange}
                                required
                                className="w-full p-3 pr-20 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 transition"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600 hover:text-violet-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>

                        </div>

                    </div>

                    {/* PHONE NUMBER */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={(e) => {

                                const onlyNums =
                                    e.target.value.replace(/\D/g, '');

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
                            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 transition"
                        />

                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white font-bold py-3 rounded-2xl shadow-lg transition duration-300"
                    >
                        Create Account
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Signup;