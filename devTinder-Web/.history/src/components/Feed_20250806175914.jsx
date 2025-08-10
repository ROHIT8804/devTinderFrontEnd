import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setFeed } from '../utils/feedSlice';

function Feed(){

    const dispatch = useDispatch();
    const feedData = useSelector((state) => {
                        console.log(state);
                        return state.feed;
                    });
    console.log("Feed Data:", feedData);
    const handleFeed = async () => {
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
            <span>Feed Component</span>
        </div>
    )
}

export default Feed;