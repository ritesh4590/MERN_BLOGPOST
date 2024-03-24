import React, { useState } from 'react';
import './ProfileIcon.css';
import Options from '../Options/Options';
import profileImage from '../../assets/image-avatar.png'


const ProfileIcon = ({ firstChar, user, success }) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="profile-icon" onClick={toggleOptions}>

      {firstChar ?
        <div className='profile-icon-circle'>{firstChar}</div>
        :
        <img src={profileImage} alt="Profile_Image" />
      }

      {showOptions && <Options user={user} success={success} />}
    </div >
  );
};

export default ProfileIcon;
