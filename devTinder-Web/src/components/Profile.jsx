import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import ProfileCard from './ProfileCard';

function Profile() {
  
  const user = useSelector((state) => state.user?.userData || {});

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState(user.gender|| "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [response, setResponse] = useState({});
  console.log("user", user);
  const userData = {
    firstName: firstName,
    lastName: lastName,gender:gender,photoUrl:photoUrl}
  
  

  const handleProfileEdit = async (e) => {
    try {
      setError("");
      setResponse({});
      const response = await axios.patch(BASE_URL + '/profile/update', {
        firstName: firstName,
        lastName:lastName,
        gender:gender,
        photoUrl:photoUrl
      },
      {withCredentials: true}
    );
      setResponse(response.data);
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
    <>
    <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
  {/* Edit Profile Card */}
  <div className="card card-border bg-base-100 w-96" style={{ backgroundColor: "#e0f2fe" }}>
    <h2 className="card-title justify-center">User Profile</h2>
    <div className="card-body">
      <div className="mt-5">
        <label className="input validator">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </label>
      </div>
      <div className="mt-2">
        <label className="input validator">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </label>
      </div>
      <div className="mt-2">
        <label className="input validator">
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Gender"
          />
        </label>
      </div>
      <div className="mt-2">
        <label className="input validator">
          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Photo Url"
          />
        </label>
      </div>

      <p className="text-red-500 text-left w-full">{error}</p>
      <p className="text-green-500 text-left w-full">{response?.message}</p>
      <div className="card-actions justify-center mt-5">
        <button className="btn btn-primary" onClick={handleProfileEdit}>
          Save
        </button>
      </div>
    </div>
  </div>

  {/* Profile Card */}
  <ProfileCard user={userData} />
</div>

    </>
    
  );

}

export default Profile;