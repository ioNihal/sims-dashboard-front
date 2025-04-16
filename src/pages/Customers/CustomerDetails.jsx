// src/pages/Customers/CustomerDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/customerDetails.module.css";
import { capitalize, formatDate } from "../../utils/validators";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`https://suims.vercel.app/api/customer/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch customer details");
        }
        const json = await res.json();
        // Expecting the API to return the customer data in the `data` field
        const customerData = json.data;
        setCustomer(customerData);
      } catch (err) {
        console.error("Error fetching customer details:", err);
        setError("Error fetching customer details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
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
            <span className={styles.detailValue}>
              {`CU${customer._id.substring(5, 10).toUpperCase()}`}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name:</span>
            <span className={styles.detailValue}>{capitalize(customer.name)}</span>
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
            <span className={styles.detailValue}>{capitalize(customer.address)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Created At:</span>
            <span className={`${styles.detailValue} ${styles.date}`}>
              {formatDate(customer.createdAt)}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Updated At:</span>
            <span className={`${styles.detailValue} ${styles.date}`}>
              {formatDate(customer.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
