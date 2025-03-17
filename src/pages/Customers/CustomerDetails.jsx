// pages/Customers/CustomerDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/PageStyles/Customers/customerDetails.module.css";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      const customers = JSON.parse(savedCustomers);
      const foundCustomer = customers.find(
        (cust) => String(cust.id) === id
      );
      if (foundCustomer) {
        setCustomer(foundCustomer);
      } else {
        alert("Customer not found");
        navigate("/customers");
      }
    } else {
      alert("No customers available");
      navigate("/customers");
    }
  }, [id, navigate]);

  if (!customer) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/customers")}>
        Back
      </button>
      <div className={styles.card}>
        <div className={styles.title}>Customer Details</div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>ID:</span>
            <span className={styles.detailValue}>{customer.id}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name:</span>
            <span className={styles.detailValue}>{customer.name}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailValue}>{customer.email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone:</span>
            <span className={styles.detailValue}>{customer.phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Address:</span>
            <span className={styles.detailValue}>{customer.address}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Password:</span>
            <span className={styles.detailValue}>
              {showPassword
                ? customer.password
                : "*".repeat(customer.password.length)}
            </span>
            <button
              className={styles.toggleBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
