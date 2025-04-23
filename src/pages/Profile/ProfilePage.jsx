import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaKey, FaSave, FaTimes } from "react-icons/fa";
import styles from "../../styles/PageStyles/Profile/profilePage.module.css";
import { capitalize } from "../../utils/validators";


const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile({
        name: user.name || "Admin User",
        email: user.email || "placeholder@email.com",
        role: user.isAdmin ? "Administrator" : "Hacker",
        id: user.id ? `AD.${user.id.substring(10, 15).toUpperCase()}` : "AdminID",
      });
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  // Sync temporary profile when profile state changes.
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
    // Optionally, update localStorage or make API update call here.
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
        <p className={styles.role}>{profile.role}</p>
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.infoRow}>
          <label>Name:</label>
          <div className={styles.valueOrInput}>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={tempProfile.name || ""}
                onChange={handleChange}
                className={styles.editInput}
              />
            ) : (
              <span>{capitalize(profile.name)}</span>
            )}
          </div>
        </div>
        <div className={styles.infoRow}>
          <label>Email:</label>
          <div className={styles.valueOrInput}>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={tempProfile.email || ""}
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
            <button
              className={`${styles.actionBtn} ${styles.editBtn}`}
              onClick={handleSave}
            >
              <FaSave className={styles.icon} /> Save
            </button>
            <button
              className={`${styles.actionBtn} ${styles.logoutBtn}`}
              onClick={handleCancel}
            >
              <FaTimes className={styles.icon} /> Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className={`${styles.actionBtn} ${styles.editBtn}`}
              onClick={handleEditToggle}
            >
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
