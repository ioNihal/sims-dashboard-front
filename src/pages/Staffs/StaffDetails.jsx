// src/pages/Staffs/StaffDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Staffs/staffDetails.module.css";

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const savedStaffs = localStorage.getItem("staffs");
    if (savedStaffs) {
      const staffs = JSON.parse(savedStaffs);
      const foundStaff = staffs.find(
        (s) => String(s.id) === id
      );
      if (foundStaff) {
        setStaff(foundStaff);
      } else {
        alert("Staff not found");
        navigate("/staffs");
      }
    } else {
      alert("No staffs available");
      navigate("/staffs");
    }
  }, [id, navigate]);

  if (!staff) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/staffs")}>
        Back
      </button>
      <div className={styles.card}>
        <div className={styles.title}>Staff Details</div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>ID:</span>
            <span className={styles.detailValue}>{staff.id}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name:</span>
            <span className={styles.detailValue}>{staff.name}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailValue}>{staff.email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone:</span>
            <span className={styles.detailValue}>{staff.phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Address:</span>
            <span className={styles.detailValue}>{staff.address}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Status:</span>
            <span className={styles.detailValue}>{staff.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
