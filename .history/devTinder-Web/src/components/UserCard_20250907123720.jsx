import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/userSlice';
import { setFeed } from '../utils/feedSlice';
import { useNavigate } from 'react-router-dom';

function UserCard({ user }) {
    console.log("user Data",user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [noRequestsMessage, setNoRequestsMessage] = useState("");

    const handleRequests = async (data,_id)=>{
    console.log("data",data)
    console.log("_id",_id)
    try {
      let url = BASE_URL + '/request/send/'+ `${data}` + `/${_id}`;
      const response = await axios.post(url,{}, { withCredentials: true });
      console.log("response", response);
      if(response.status === 200){
        dispatch(setFeed(user.feedData.filter(data=> data._id !== _id)))
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
              localStorage.removeItem("user");
              dispatch(logout());
              navigate("/login");
            }
      console.error("Error:", error); 
    }
  }

  useEffext(()=>{
    
  })

  return (
    <div className="flex flex-wrap gap-4">
      {Array.isArray(user?.feedData) && user?.feedData.map((user, index) => (
        <div key={user._id || index} className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <img
              src={user.photoUrl || "https://placeimg.com/400/225/arch"}
              alt={`${user.firstName} ${user.lastName}`}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {user.firstName} {user.lastName}
            </h2>
            <p>
              A card component has a figure, a body part, and inside body there are title and actions parts
            </p>
            <div className="card-actions justify-center my-4">
              <button onClick={()=>handleRequests('ignored',user._id)} className="btn btn-primary">Ignore</button>
              <button onClick={()=>handleRequests('interested',user._id)} className="btn btn-primary">Interested</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserCard;

