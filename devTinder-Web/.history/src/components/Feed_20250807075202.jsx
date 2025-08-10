import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setFeed } from '../utils/feedSlice';
import UserCard  from './UserCard';

function Feed(){

    const dispatch = useDispatch();
    const feedData = useSelector((state) => state.feed);
    console.log("Feed Data:", feedData);
    const handleFeed = async () => {
        if(feedData.feedData) return;
        try{
            const response = await axios.get(BASE_URL + '/feed', { withCredentials: true });
            console.log("Feed data:", response.data);
            dispatch(setFeed(response.data));
        }
        catch (error) {
            console.error("Error fetching feed:", error);
        }
    } 

    useEffect(() => {
        handleFeed();
    }, []);

    return (
        <div>
            <UserCard user = {feedData}/>
        </div>
    )
}

export default Feed;