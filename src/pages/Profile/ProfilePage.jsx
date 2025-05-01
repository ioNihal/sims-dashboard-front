// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaKey, FaSave, FaTimes } from "react-icons/fa";
import styles from "../../styles/PageStyles/Profile/profilePage.module.css";
import { capitalize, validateName, validateEmail, validatePassword } from "../../utils/validators";
import { updateAdmin } from "../../api/admin";
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [mode, setMode] = useState("view");
  const [tempProfile, setTempProfile] = useState({});
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pwdValues, setPwdValues] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdErrors, setPwdErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setProfile({
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "Administrator" : "Hacker",
        id: user.id ? `AD.${user.id.substring(10, 15).toUpperCase()}` : "AdminID",
      });
    }
  }, []);

  // sync tempProfile when profile changes
  useEffect(() => {
    setTempProfile(profile);
    setErrors({ name: "", email: "" });
  }, [profile]);

  const switchMode = (m) => {
    setError(null);
    setErrors({ name: "", email: "" });
    setPwdErrors({ newPassword: "", confirmPassword: "" });
    if (m === "view") {
      setTempProfile(profile);
      setPwdValues({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
    setMode(m);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({ ...p, [name]: value }));
    let msg = "";
    if (name === "name") msg = validateName(value);
    if (name === "email") msg = validateEmail(value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSave = async () => {
    const nameErr = validateName(tempProfile.name || "");
    const emailErr = validateEmail(tempProfile.email || "");
    setErrors({ name: nameErr, email: emailErr });
    if (nameErr || emailErr) return;

    setLoading(true);
    try {
      const payload = {};
      ["name", "email"].forEach((key) => {
        if (tempProfile[key] !== profile[key]) {
          payload[key] = window.btoa(tempProfile[key]);
        }
      });
      await updateAdmin(payload);
      setProfile(tempProfile);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), name: tempProfile.name, email: tempProfile.email })
      );
      toast.success("Profile updated successfully!");
      switchMode("view");
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdValues((p) => ({ ...p, [name]: value }));
    let msg = "";
    if (name === "newPassword") {
      msg = validatePassword(value);
      if (pwdValues.confirmPassword && pwdValues.confirmPassword !== value) {
        setPwdErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      } else {
        setPwdErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
    if (name === "confirmPassword" && value !== (name === "confirmPassword" ? pwdValues.newPassword : value)) {
      msg = "Passwords do not match.";
    }

    setPwdErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handlePwdSubmit = async () => {
    const newErr = validatePassword(pwdValues.newPassword);
    const confirmErr = pwdValues.newPassword !== pwdValues.confirmPassword ? "Passwords do not match." : "";
    setPwdErrors({ newPassword: newErr, confirmPassword: confirmErr });
    if (newErr || confirmErr) return;

    setPwdLoading(true);
    try {
      await updateAdmin({ password: window.btoa(pwdValues.newPassword) });
      toast.success("Password changed successfully!");
      switchMode("view");
    } catch (e) {
      setPwdErrors((prev) => ({ ...prev, oldPassword: e.message }));
      toast.error(e.message || "Failed to update password.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    ["isLoggedIn", "adminEmail", "user"].forEach((k) => localStorage.removeItem(k));
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <FaUserCircle className={styles.avatar} />
        <p className={styles.role}>{profile.role}</p>
      </div>

      <div className={styles.profileBody}>
        {/* VIEW */}
        <div className={`${styles.pane} ${mode === "view" ? styles.active : ""}`}>
          <h2 className={styles.sectionTitle}>Profile Details</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.infoRow}><label>Name:</label><span>{capitalize(profile.name)}</span></div>
          <div className={styles.infoRow}><label>Email:</label><span>{profile.email}</span></div>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => switchMode("edit")}><FaEdit className={styles.icon} /> Edit</button>
            <button className={styles.actionBtn} onClick={() => switchMode("password")}><FaKey className={styles.icon} /> Change Password</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* EDIT */}
        <div className={`${styles.pane} ${mode === "edit" ? styles.active : ""}`}>
          <h2 className={styles.sectionTitle}>Edit Profile</h2>
          {errors.name && <small className={styles.fieldError}>{errors.name}</small>}
          <div className={styles.infoRow}><label>Name:</label><input name="name" value={tempProfile.name || ""} onChange={handleChange} className={styles.editInput} disabled={loading} /></div>
          {errors.email && <small className={styles.fieldError}>{errors.email}</small>}
          <div className={styles.infoRow}><label>Email:</label><input name="email" value={tempProfile.email || ""} onChange={handleChange} className={styles.editInput} disabled={loading} /></div>
          <div className={styles.actions}>
            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={handleSave} disabled={loading}><FaSave className={styles.icon} />{loading ? "Saving..." : "Save"}</button>
            <button className={styles.actionBtn} onClick={() => switchMode("view")} disabled={loading}><FaTimes className={styles.icon} /> Cancel</button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className={`${styles.pane} ${mode === "password" ? styles.active : ""}`}>
          <h2 className={styles.sectionTitle}>Update Password</h2>
          {pwdErrors.oldPassword && <small className={styles.fieldError}>{pwdErrors.oldPassword}</small>}
          <div className={styles.infoRow}><label>Old Password:</label>
            <input type="password" name="oldPassword" value={pwdValues.oldPassword} onChange={handlePwdChange} className={styles.editInput} disabled={pwdLoading} /></div>
          {pwdErrors.newPassword && <small className={styles.fieldError}>{pwdErrors.newPassword}</small>}
          <div className={styles.infoRow}><label>New Password:</label>
            <input type="password" name="newPassword" value={pwdValues.newPassword} onChange={handlePwdChange} className={styles.editInput} disabled={pwdLoading} /></div>
          {pwdErrors.confirmPassword && <small className={styles.fieldError}>{pwdErrors.confirmPassword}</small>}
          <div className={styles.infoRow}><label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={pwdValues.confirmPassword} onChange={handlePwdChange} className={styles.editInput} disabled={pwdLoading} /></div>
          <div className={styles.actions}>
            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={handlePwdSubmit} disabled={pwdLoading}>{pwdLoading ? "Updating..." : "Update"}</button>
            <button className={styles.actionBtn} onClick={() => switchMode("view")} disabled={pwdLoading}>Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
