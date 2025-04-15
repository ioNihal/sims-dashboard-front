// src/components/ProfileWidget.jsx
import React from "react";
import styles from "../../styles/widgets/ProfileWidget.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ProfileWidget = ({ user }) => {
    const navigate = useNavigate();
    
    return (
      <div className={styles.widget}>
       {user.avatar ? (
          <img src={user.avatar} alt="Profile" className={styles.avatar} />
        ) : (
          <FaUserCircle className={styles.avatar} />
        )}
        <div className={styles.info}>
          <span className={styles.username}>{user.name}</span>
          <NavLink to='/profile' className={styles.viewProfile}>View Profile</NavLink>
        </div>
      </div>
    );
  };
  
  export default ProfileWidget;
