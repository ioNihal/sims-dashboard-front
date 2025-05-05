// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaKey, FaSave, FaTimes, FaEyeSlash, FaEye } from "react-icons/fa";
import styles from "../../styles/PageStyles/Profile/profilePage.module.css";
import { capitalize, validateName, validateEmail, validatePassword, validatePhone } from "../../utils/validators";
import { updateAdmin } from "../../api/admin";
import { toast } from 'react-hot-toast';
import ConfirmDialog from "../../components/ConfirmDialog";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [mode, setMode] = useState("view");
  const [tempProfile, setTempProfile] = useState({});
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [pwdValues, setPwdValues] = useState({ newPassword: "", confirmPassword: "" });
  const [pwdErrors, setPwdErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user?.isAdmin ? "Administrator" : "User",
        id: user.id || "AdminID",
      });
    }
  }, []);

  // sync tempProfile when profile changes
  useEffect(() => {
    setTempProfile(profile);
    setErrors({ name: "", email: "",phone: "" });
  }, [profile]);

  const switchMode = (m) => {
    setError(null);
    setErrors({ name: "", email: "",phone: "" });
    setPwdErrors({ newPassword: "", confirmPassword: "" });
    if (m === "view") {
      setTempProfile(profile);
      setPwdValues({ newPassword: "", confirmPassword: "" });
    }
    setMode(m);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({ ...p, [name]: value }));
    let msg = "";
    if (name === "name") msg = validateName(value);
    if (name === "email") msg = validateEmail(value);
    if (name === "phone") msg = validatePhone(value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSave = async () => {
    const nameErr = validateName(tempProfile.name || "");
    const emailErr = validateEmail(tempProfile.email || "");
    const phoneErr = validatePhone(tempProfile.phone || "");
    setErrors({ name: nameErr, email: emailErr, phone: phoneErr });
    if (nameErr || emailErr || phoneErr) return;

    setLoading(true);
    try {
      const payload = {};
      ["name", "email", "phone"].forEach((key) => {
        if (tempProfile[key] !== profile[key]) {
          payload[key] = window.btoa(tempProfile[key]);
        }
      });
      await updateAdmin(payload);
      setProfile(tempProfile);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), name: tempProfile.name, email: tempProfile.email, phone: tempProfile.phone })
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

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
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
    if (name === "confirmPassword" && value !== pwdValues.newPassword) {
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
    ["isLoggedIn", "adminEmail", "user", "token"].forEach((k) => localStorage.removeItem(k));
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
        <div className={`${styles.pane} ${styles.profilePane} ${mode === "view" ? styles.active : ""}`}>
          <h2 className={styles.sectionTitle}>Profile Details</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.userInfoRow}>
            <label>Name:</label>
            <span> {capitalize(profile.name)}</span>
          </div>
          <div className={styles.userInfoRow}>
            <label>Email:</label>
            <span> {profile.email}</span>
          </div>
          <div className={styles.userInfoRow}>
            <label>Phone:</label>
            <span> +91 {profile.phone}</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => switchMode("edit")}>
              <FaEdit className={styles.icon} /> Edit</button>
            <button className={styles.actionBtn} onClick={() => switchMode("password")}>
              <FaKey className={styles.icon} /> Change Password</button>
            <button className={styles.logoutBtn} onClick={() => setShowConfirm(true)}>
              Logout
            </button>
            {showConfirm && (
              <ConfirmDialog
                message="Sure you want to logout?"
                onConfirm={() => {
                  setShowConfirm(false);
                  handleLogout();
                }}
                onCancel={() => setShowConfirm(false)}
              />
            )}
          </div>
        </div>

        {/* EDIT */}
        <div className={`${styles.pane} ${mode === "edit" ? styles.active : ""}`}>
          <h2 className={styles.sectionTitle}>Edit Profile</h2>


          <div className={styles.infoRow}>
            <label>Name:</label>
            <div className={styles.inputWrapper}>
              <input name="name" value={tempProfile.name || ""}
                onChange={handleChange}
                className={styles.editInput}
                disabled={loading} />
              {errors.name && <small className={styles.fieldError}>{errors.name}</small>}
            </div>
          </div>


          <div className={styles.infoRow}>
            <label>Email:</label>
            <div className={styles.inputWrapper}>
              <input name="email" value={tempProfile.email || ""}
                onChange={handleChange}
                className={styles.editInput}
                disabled={loading} />
              {errors.email && <small className={styles.fieldError}>{errors.email}</small>}
            </div>
          </div>

          <div className={styles.infoRow}>
            <label>Phone (+91):</label>
            <div className={styles.inputWrapper}>
              <input name="phone" value={tempProfile.phone || ""}
                onChange={handleChange}
                className={styles.editInput}
                disabled={loading} />
              {errors.phone && <small className={styles.fieldError}>{errors.phone}</small>}
            </div>
          </div>


          <div className={styles.actions}>
            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={handleSave} disabled={loading}><FaSave className={styles.icon} />{loading ? "Saving..." : "Save"}</button>
            <button className={styles.actionBtn} onClick={() => switchMode("view")} disabled={loading}><FaTimes className={styles.icon} /> Cancel</button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className={`${styles.pane} ${mode === "password" ? styles.active : ""}`}>
          <h2 className={styles.sectionTitle}>Update Password</h2>


          <div className={styles.infoRow}>
            <label>New Password:</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={pwdValues.newPassword}
                onChange={handlePwdChange}
                className={styles.editInput}
                disabled={pwdLoading}
              />
              <span className={styles.eyeIcon} onClick={() => togglePassword("newPassword")}>
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {pwdErrors.newPassword && <small className={styles.fieldError}>{pwdErrors.newPassword}</small>}
            </div>
          </div>




          <div className={styles.infoRow}>
            <label>Confirm Password:</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={pwdValues.confirmPassword}
                onChange={handlePwdChange}
                className={styles.editInput}
                disabled={pwdLoading}
              />
              <span className={styles.eyeIcon} onClick={() => togglePassword("confirmPassword")}>
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {pwdErrors.confirmPassword && <small className={styles.fieldError}>{pwdErrors.confirmPassword}</small>}
            </div>
          </div>


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
