import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Login/loginPage.module.css";
import useLogin from "../../hooks/useLogin";

const LoginPage = () => {
  const { email, setEmail, password, setPassword, error, isLogging, handleLogin } = useLogin();
  const navigate = useNavigate();

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
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={isLogging}>
            {isLogging ? "Logging in..." : "Login"}
          </button>
          {/* <p className={styles.switchText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} className={styles.link}>
              Register here
            </span>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
