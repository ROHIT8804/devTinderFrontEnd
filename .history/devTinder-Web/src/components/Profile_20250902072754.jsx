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
  const [gender, setGender] = useState(user.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [response, setResponse] = useState({});
  console.log("user", user);
  const userData = {
    firstName: firstName,
    lastName: lastName, gender: gender, photoUrl: photoUrl
  }



  const handleProfileEdit = async (e) => {
    try {
      setError("");
      setResponse({});
      const response = await axios.patch(BASE_URL + '/profile/update', {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        photoUrl: photoUrl
      },
        { withCredentials: true }
      );
      setResponse(response.data);
    } catch (error) {
      setError(error?.response?.data || "Login failed. Please try again.");
      if (error.response && error.response.status === 401) {
              localStorage.removeItem("user");
              dispatch(logout());
              navigate("/login");
            }
      console.error("Error handling email change:", error?.response?.data);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    // if(user){
    //   navigate('/feed');
    // }
  }, [navigate]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">

        <div className="card card-border bg-base-100 w-96 h-fit md:h-[450px] flex flex-col" style={{ backgroundColor: "#e0f2fe" }}>
          <div className="card-body flex flex-col h-full">
            <h2 className="card-title justify-center mb-4">User Profile</h2>
            
            <div className="flex-grow space-y-4">
              <div>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="grow"
                  />
                </label>
              </div>
              
              <div>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="grow"
                  />
                </label>
              </div>
              
              <div>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="Gender"
                    className="grow"
                  />
                </label>
              </div>
              
              <div>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Photo URL"
                    className="grow"
                  />
                </label>
              </div>
              
              {error && <p className="text-red-500 text-left w-full">{error}</p>}
              {response?.message && <p className="text-green-500 text-left w-full">{response.message}</p>}
            </div>
            
            <div className="card-actions justify-center mt-6">
              <button className="btn btn-primary px-8" onClick={handleProfileEdit}>
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="w-96 md:h-[450px]">
          <ProfileCard user={userData} />
        </div>
      </div>
    </div>

  );

}

export default Profile;