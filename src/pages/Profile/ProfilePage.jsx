// pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaKey, FaSave, FaTimes } from "react-icons/fa";
import styles from "../../styles/PageStyles/Profile/profilePage.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("adminEmail") || "admin@example.com";
  
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: storedEmail,
    password: "********",
    role: "Administrator",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  const handleEditToggle = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    // Update localStorage or send to backend if needed
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    navigate("/profile/change-password");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <FaUserCircle className={styles.avatar} />
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={tempProfile.name}
            onChange={handleChange}
            className={styles.editInput}
          />
        ) : (
          <h1 className={styles.title}>{profile.name}</h1>
        )}
        <p className={styles.role}>{profile.role}</p>
      </div>

      <div className={styles.profileInfo}>
        {/* Email row */}
        <div className={styles.infoRow}>
          <label>Email:</label>
          <div className={styles.valueOrInput}>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={tempProfile.email}
                onChange={handleChange}
                className={styles.editInput}
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>
        </div>
        
      </div>

      <div className={styles.actions}>
        {isEditing ? (
          <>
            <button className={styles.actionBtn} onClick={handleSave}>
              <FaSave className={styles.icon} /> Save
            </button>
            <button className={styles.actionBtn} onClick={handleCancel}>
              <FaTimes className={styles.icon} /> Cancel
            </button>
          </>
        ) : (
          <>
            <button className={styles.actionBtn} onClick={handleEditToggle}>
              <FaEdit className={styles.icon} /> Edit Profile
            </button>
            <button className={styles.actionBtn} onClick={handleChangePassword}>
              <FaKey className={styles.icon} /> Change Password
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
