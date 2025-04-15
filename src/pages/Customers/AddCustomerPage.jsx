// src/pages/Customers/AddCustomerPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/addCustomerPage.module.css";
import { validateName, validateEmail, validatePhone, validateAddress } from "../../utils/validators";
import { generatePassword } from "../../utils/passwordUtils";

const AddCustomerPage = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const newCustomer = { ...customer, password: generatePassword() };
  
    setError("");
    setIsSaving(true);
  
    const nameError = validateName(newCustomer.name);
    const emailError = validateEmail(newCustomer.email);
    const phoneError = validatePhone(newCustomer.phone);
    const addressError = validateAddress(newCustomer.address);
  
    if (nameError || emailError || phoneError || addressError) {
      setError(nameError || emailError || phoneError || addressError);
      setIsSaving(false);
      return;
    }
  
    try {
      const response = await fetch("https://suims.vercel.app/api/customer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) {
        throw new Error("Failed to add customer");
      }
      const data = await response.json();
      navigate("/customers");
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Error adding customer. Please try again.");
      setIsSaving(false);
    }
  };  

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className={styles.container}>
      <h1>Add New Customer</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter customer name"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn} disabled={isSaving}>
            {`${isSaving ? "Saving..." : "Save"}`}
          </button>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerPage;
