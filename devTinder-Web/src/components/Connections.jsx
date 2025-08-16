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
        if(connectionsData) return;
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
        <div className="flex flex-wrap gap-4">
                {Array.isArray(connectionsData) && connectionsData.map((connectionsData) => (
                    <div key={connectionsData.id} className="card bg-base-100 w-96 shadow-sm">
                        <figure>
                            <img
                                src={connectionsData?.toUserId?.photoUrl || "https://placeimg.com/400/225/arch"}
                                alt={`${connectionsData?.toUserId?.firstName} ${connectionsData?.toUserId?.lastName}`}
                                className="h-60 w-55 object-cover" // Example with Tailwind
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {connectionsData?.toUserId?.firstName} {connectionsData?.toUserId?.lastName}
                            </h2>
                            <p>
                                A card component has a figure, a body part, and inside body there are title and actions parts
                            </p>
                            <div className="card-actions justify-center my-4">
                                {/* <button className="btn btn-primary">Ignore</button>
                                <button className="btn btn-primary">Interested</button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default connections