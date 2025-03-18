// pages/Customers/CustomerDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customerDetails.module.css";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

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

  const handleResetPassword = async () => {
    try {
      // Example API call (update URL, method, and headers as needed)
      const response = await fetch(`/api/resetPassword?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Optionally, send a body if your API requires it.
        // body: JSON.stringify({ customerId: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
      const data = await response.json();
      // Assume the API returns the new password as data.newPassword
      const updatedCustomer = { ...customer, password: data.newPassword };
      setCustomer(updatedCustomer);
      
      // Update the customer in localStorage
      const savedCustomers = JSON.parse(localStorage.getItem("customers") || "[]");
      const updatedCustomers = savedCustomers.map((cust) =>
        String(cust.id) === id ? updatedCustomer : cust
      );
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      alert("Password has been reset!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while resetting the password.");
    }
  };

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
            <button
              className={styles.resetBtn}
              onClick={handleResetPassword}
            >
              Reset Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
