import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        password: '',
        age: '',
        gender: '',
        photoUrl: '',
        about: '',
        skills: []
    });

    const [skillInput, setSkillInput] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && formData.skills.length < 5) {
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, skillInput.trim()]
                }));
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return passwordRegex.test(password);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.emailId.trim()) {
            errors.emailId = 'Email is required';
        } else if (!validateEmail(formData.emailId)) {
            errors.emailId = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        } else if (!validatePassword(formData.password)) {
            errors.password = 'Password must contain at least one number, one lowercase and one uppercase letter';
        }

        if (formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 120)) {
            errors.age = 'Age must be at least 18';
        }

        if (formData.about && formData.about.length > 500) {
            errors.about = 'About section must be less than 500 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUp = async () => {
        if (validateForm()) {
            console.log('Form submitted:', formData);
            try {
                const response = await axios.post(BASE_URL + '/signup', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    emailId: formData.emailId,
                    password: formData.password,
                    age: formData.age,
                    gender: formData.gender,
                    photoUrl: formData.photoUrl,
                    about: formData.about,
                    skills: formData.skills
                }
                );
                console.log('Sign up successful:', response);
                //   const { firstName, emailId } = response.data.user;
                //   localStorage.setItem('user', JSON.stringify({ name: firstName, email: emailId }));
                //   dispatch(setUser(response.data.user));

                navigate('/login')
            } catch (error) {
                setError(error?.response?.data || "SignUp failed. Please try again.");
                console.error("Error handling email change:", error);
            }
        } else {
            setError('Please fix the validation errors');
        }
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            action();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="card card-border bg-base-100 w-full max-w-md" style={{ backgroundColor: "#e0f2fe" }}>
                <h2 className="card-title justify-center text-2xl font-bold p-4">Sign Up</h2>

                <div className="card-body space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="input validator flex items-center gap-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="First Name *"
                                required
                                className="flex-1"
                            />
                        </label>
                        {validationErrors.firstName && (
                            <div className="validator-hint text-red-500 text-sm mt-1">{validationErrors.firstName}</div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="input validator flex items-center gap-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                                className="flex-1"
                            />
                        </label>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="input validator flex items-center gap-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input
                                type="email"
                                name="emailId"
                                value={formData.emailId}
                                onChange={handleInputChange}
                                placeholder="mail@site.com *"
                                required
                                className="flex-1"
                            />
                        </label>
                        {validationErrors.emailId && (
                            <div className="validator-hint text-red-500 text-sm mt-1">{validationErrors.emailId}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="input validator flex items-center gap-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password *"
                                required
                                className="flex-1"
                            />
                        </label>
                        {validationErrors.password && (
                            <div className="validator-hint text-red-500 text-sm mt-1">{validationErrors.password}</div>
                        )}
                    </div>

                    {/* Age */}
                    <div>
                        <label className="input validator flex items-center gap-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </g>
                            </svg>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="Age (18+)"
                                min="18"
                                className="flex-1"
                            />
                        </label>
                        {validationErrors.age && (
                            <div className="validator-hint text-red-500 text-sm mt-1">{validationErrors.age}</div>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label className="input validator flex items-center gap-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    <circle cx="9" cy="9" r="2"></circle>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                </g>
                            </svg>
                            <input
                                type="url"
                                name="photoUrl"
                                value={formData.photoUrl}
                                onChange={handleInputChange}
                                placeholder="Photo URL (optional)"
                                className="flex-1"
                            />
                        </label>
                    </div>

                    {/* About */}
                    <div>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself (max 500 characters)"
                            maxLength="500"
                            className="textarea textarea-bordered w-full h-20 resize-none"
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {formData.about.length}/500
                        </div>
                        {validationErrors.about && (
                            <div className="validator-hint text-red-500 text-sm mt-1">{validationErrors.about}</div>
                        )}
                    </div>

                    {/* Skills */}
                    <div>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, addSkill)}
                                placeholder="Add skill (max 5)"
                                className="input input-bordered flex-1"
                                disabled={formData.skills.length >= 5}
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                disabled={!skillInput.trim() || formData.skills.length >= 5}
                                className="btn btn-outline btn-sm"
                            >
                                Add
                            </button>
                        </div>

                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="badge badge-primary gap-2">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-white hover:text-red-200"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="text-sm text-gray-500 mt-1">
                            Skills: {formData.skills.length}/5
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-left w-full">{error}</p>
                    )}

                    <div className="card-actions justify-center mt-6">
                        <button className="btn btn-primary w-full" onClick={handleSignUp}>
                            Sign Up
                        </button>
                    </div>

                    <p className="text-center w-full mt-3">
                        <span className="text-black">Already have an account? </span>
                        <a href="/login" className="text-sky-500 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp