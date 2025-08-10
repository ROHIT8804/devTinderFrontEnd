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
            <input type="email" value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First Name"  />
          </label>
        </div>
        <div className="mt-2">
          <label className="input validator">
            <input type="email" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last Name"  />
          </label>
        </div>
        <div className="mt-2">
          <label className="input validator">
            <input type="email" value={gender} onChange={(e)=>setGender(e.target.value)} placeholder="Gender"  />
          </label>
        </div>
        <div className="mt-2">
          <label className="input validator">
            <input type="email" value={photoUrl} onChange={(e)=>setPhotoUrl(e.target.value)} placeholder="Photo Url"  />
          </label>
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