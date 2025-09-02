import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setFeed } from '../utils/feedSlice';
import UserCard  from './UserCard';
import { useNavigate } from 'react-router-dom';

function Feed(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const feedData = useSelector((state) => state.feed);
    const handleFeed = async () => {
        console.log("Fetching feed data...", feedData);
        if(feedData.feedData) return;
        try{
            const response = await axios.get(BASE_URL + '/users/feed', { withCredentials: true });
            dispatch(setFeed(response.data));
        }
        catch (error) {
            debugger
            console.error("Error fetching feed:", error);
            if (error.response && error.response.status === 401) {
                    localStorage.removeItem("user");
                    dispatch(logout());
                    navigate("/login");
                  }
    } 
}

    useEffect(() => {
        handleFeed();
    }, []);

    return (
        <div>
            {feedData && <UserCard user = {feedData}/>}
        </div>
    )
}

export default Feed;