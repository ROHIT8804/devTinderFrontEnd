import React, { use } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setConnections } from '../utils/connectionSlice';
import { useNavigate } from 'react-router-dom';

const connections = () => {
    const handleConnection = async () => {
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
        <div>connections</div>
    )
}

export default connections