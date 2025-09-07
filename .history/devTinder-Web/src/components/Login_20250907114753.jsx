import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

function Login() {
  const [email, setEmail] = useState("Jinar@gm.com");
  const [password, setPassword] = useState("Test@1234");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {

      const response = await axios.post(BASE_URL + '/login', {
        emailId: email,
        password: password
      },
        { withCredentials: true }
      );
      const { firstName, emailId } = response.data.user;
      localStorage.setItem('user', JSON.stringify({ name: firstName, email: emailId }));
      dispatch(setUser(response.data.user));

      navigate('/feed')
    } catch (error) {
      setError(error?.response?.data || "Login failed. Please try again.");
      console.error("Error handling email change:", error?.response?.data);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/feed');
    }
  }, [navigate]);

  return (
        <div className="mt-8 space-y-5">
      <label className="relative block">
        <span className="sr-only">Email</span>
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mail@site.com"
          required
          aria-label="Email"
          className="w-full pl-12 pr-3 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder:text-sky-400"
        />
      </label>
      <div className="text-xs text-red-500 hidden" role="alert">Enter valid email address</div>

      <label className="relative block">
        <span className="sr-only">Password</span>
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          minLength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          aria-label="Password"
          className="w-full pl-12 pr-3 py-3 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300 placeholder:text-sky-400"
        />
      </label>
      <p className="text-xs text-sky-600">
        Must be at least 8 characters and include one number, one lowercase and one uppercase letter
      </p>

      <p className="text-sm text-red-500 break-words" role="status">{error}</p>

      <div className="mt-4">
        <button
          className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.995] text-white font-medium transition"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>

      <p className="text-center text-sm text-sky-700">
        <span className="text-sky-800">Don't have an account? </span>
        <Link to="/signUp" className="font-semibold text-sky-600 hover:underline ml-1">Sign Up</Link>
      </p>
    </div>
)
  }

export default Login;
