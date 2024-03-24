import React from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './Options.css';

const Options = ({ user, success }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fetchProfile = () => {
        navigate("/user-profile")

    }

    return (
        <div className="options">
            <ul>
                {success && user ? <li>{user.user.name}</li> : ''}
                <li onClick={fetchProfile}>Profile</li>
            </ul>

        </div>
    );
};

export default Options;
