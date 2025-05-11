
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/NotFound.module.css"; 

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1>404 - Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default NotFound;
