import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Login/loginPage.module.css";
import useLogin from "../../hooks/useLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const { email, setEmail, password, setPassword, error, isLogging, handleLogin } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Admin Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <span className={styles.eyeIcon} onClick={togglePassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className={styles.loginBtn} disabled={isLogging}>
            {isLogging ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
