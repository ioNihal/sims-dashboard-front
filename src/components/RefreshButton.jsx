
import React from "react";
import { FiRefreshCcw } from "react-icons/fi";
import styles from "../styles/ComponentStyles/refreshButton.module.css";

const RefreshButton = ({ onClick, loading = false, label = "Refresh" }) => {
  return (
    <button className={styles.refreshBtn} onClick={onClick} disabled={loading}>
       <FiRefreshCcw className={loading ? styles.spin : ""} size={16} />
    </button>
  );
};

export default RefreshButton;
