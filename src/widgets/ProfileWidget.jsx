// src/components/ProfileWidget.jsx
import React from "react";
import styles from "../styles/widgets/ProfileWidget.module.css";
import { NavLink, useNavigate } from "react-router-dom";

const ProfileWidget = ({ user }) => {
    const navigate = useNavigate();
    
    return (
      <div className={styles.widget}>
        <img
          className={styles.avatar}
          src={user.avatarUrl || "/default-avatar.png"}
          alt={`${user.name} avatar`}
        />
        <div className={styles.info}>
          <span className={styles.username}>{user.name}</span>
          <NavLink to='/profile' className={styles.viewProfile}>View Profile</NavLink>
        </div>
      </div>
    );
  };
  
  export default ProfileWidget;
