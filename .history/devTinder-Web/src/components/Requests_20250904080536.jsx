import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NoDataCard from "./NoDataCard";
import { setRequest } from "../utils/requestSlice";
import { clearRequest } from "../utils/requestSlice";

const Requests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requestData = useSelector((state) => state.request);
  console.log("RequestData", requestData);
  const [noRequestsMessage, setNoRequestsMessage] = useState("");

  const getrequestData = async (force = false) => {
    if (!force && requestData) return;
    try {
      const response = await axios.get(BASE_URL + "/users/requests/recieved", {
        withCredentials: true,
      });
      console.log("Request response", response.data);

      dispatch(setRequest(response.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error.response && error.response.status === 404) {
        setNoRequestsMessage(
          error.response.data || "No connection requests received"
        );
        dispatch(clearRequest());
      }
    }
  };
  useEffect(() => {
    getrequestData();
  }, []);

  const handleRequests = async (data,_id)=>{
    console.log("data",data)
    console.log("_id",_id)
    try {
      let url = BASE_URL + '/request/review/'+ `${data}` + `/${_id}`;
      const response = await axios.post(url,{}, { withCredentials: true });
      console.log("response", response);
      if(response.status === 200){
        dispatch(setRequest(requestData.filter((req)=> req._id !== _id)));
      }
    } catch (error) {
      console.error("Error:", error); 
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        dispatch(logout());
        navigate("/login");
      }
    }
  }

  const shouldShowNoDataCard = () => {
    return (
      !requestData ||
      !Array.isArray(requestData) ||
      requestData.length === 0 ||
      noRequestsMessage
    );
  };

  return (
    <>
      <div className=" bg-gray-100 p-3 rounded-2xl">
        {shouldShowNoDataCard() ? (
          <NoDataCard message={noRequestsMessage} />
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {Array.isArray(requestData) &&
              requestData.map((requestData) => (
                <div
                  key={requestData._id}
                  className="w-80 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: "#28282B" }}
                >
                  <div className="relative">
                    <img
                      src={
                        requestData?.fromUserId?.photoUrl ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                      }
                      alt={`${requestData?.fromUserId?.firstName} ${requestData?.fromUserId?.lastName}`}
                      className="w-full h-50 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-3 text-center">
                      {requestData?.fromUserId?.firstName}{" "}
                      {requestData?.fromUserId?.lastName}
                    </h2>

                    <p className="text-gray-300 text-center mb-6 leading-relaxed">
                      Connect with amazing professionals and expand your network
                      with meaningful relationships.
                    </p>

                    <div className="flex gap-3 justify-center">
                      <button onClick={()=>handleRequests('rejected',requestData._id)} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex-1">
                        Ignore
                      </button>
                      <button onClick={()=>handleRequests('accepted',requestData._id)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex-1">
                        Connect
                      </button>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;
