import React, { use } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setConnections } from '../utils/connectionSlice';
import { useNavigate } from 'react-router-dom';

const connections = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const connectionsData = useSelector((state) => state.connections);
  console.log("connectionsData", connectionsData);

  const handleConnection = async () => {
    if (connectionsData) return;
    try {
      const response = await axios.get(BASE_URL + '/users/connections', { withCredentials: true });
      dispatch(setConnections(response.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }
  useEffect(() => {
    handleConnection();
  }, []);

  return (
    <>
      <div className=" bg-gray-100 p-3 rounded-2xl">
        <div className="flex flex-wrap gap-6 justify-center">
          {Array.isArray(connectionsData) && connectionsData.map((connectionData) => (
            <div
              key={connectionData._id}
              className="w-80 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#28282B' }}
            >
              <div className="relative">
                <img
                  src={connectionData?.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
                  alt={`${connectionData?.firstName} ${connectionData?.lastName}`}
                  className="w-full h-50 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                  {connectionData?.firstName} {connectionData?.lastName}
                </h2>

                <p className="text-gray-300 text-center mb-6 leading-relaxed">
                  Connect with amazing professionals and expand your network with meaningful relationships.
                </p>

                <div className="flex gap-3 justify-center">
                  {/* <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex-1">
        Ignore
      </button>
      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex-1">
        Connect
      </button> */}
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default connections