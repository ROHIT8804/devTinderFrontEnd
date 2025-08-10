import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

function Profile() {
  
  const user = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleProfileEdit = async (e) => {
    try {
      const response = await axios.patch(BASE_URL + '/profile/update', {
        firstName: firstName,
        lastName:lastName,
        gender:gender,
        photoUrl:photoUrl
      },
      {withCredentials: true}
    );
    // const { firstName, emailId } = response.data.user;
    // localStorage.setItem('user', JSON.stringify({ name:firstName, email: emailId }));
    // dispatch(setUser({ name:firstName, email: emailId }));

    } catch (error) {
      setError(error?.response?.data || "Login failed. Please try again.");
      console.error("Error handling email change:", error?.response?.data);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    // if(user){
    //   navigate('/feed');
    // }
  },[navigate]);

  return (
    <div className="card card-border bg-base-100 w-96" style={{ backgroundColor: "#e0f2fe" }}>
        <h2 className="card-title justify-center">User Profile</h2>
      <div className="card-body">
        <div className="mt-5">
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
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
            <input type="email" value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First Name" required />
          </label>
          <input type="email" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last Name" required />
        </div>
        
        <p className="text-red-500 text-left w-full">{error}</p>
        <div className="card-actions justify-center mt-5">
          <button className="btn btn-primary" onClick={handleProfileEdit}>Save</button>
        </div>
      </div>
    </div>
  );

}

export default Profile;