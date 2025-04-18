// src/pages/Customers/AddCustomerPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/addCustomerPage.module.css";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
} from "../../utils/validators";
import { generatePassword } from "../../utils/passwordUtils";

const AddCustomerPage = () => {
  // State to hold customer data
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  // State to hold error messages for each field
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  // Global submission error (if needed)
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Live validate individual field on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update state for customer values
    setCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));

    // Determine error message based on field
    let errorMessage = "";
    switch (name) {
      case "name":
        errorMessage = validateName(value);
        break;
      case "email":
        errorMessage = validateEmail(value);
        break;
      case "phone":
        errorMessage = validatePhone(value);
        break;
      case "address":
        errorMessage = validateAddress(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  // Validate all fields before submission
  const validateFields = () => {
    const nameError = validateName(customer.name);
    const emailError = validateEmail(customer.email);
    const phoneError = validatePhone(customer.phone);
    const addressError = validateAddress(customer.address);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      address: addressError,
    });

    return !(nameError || emailError || phoneError || addressError);
  };

  // Submission handler
  const handleSubmit = async () => {
    setSubmitError(""); // Clear any previous submission errors
    if (!validateFields()) {
      return;
    }

    const newCustomer = { ...customer, password: generatePassword() };
    setIsSaving(true);

    try {
      const response = await fetch("https://suims.vercel.app/api/customer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.message || "Failed to add customer");
        setIsSaving(false);
        return;
      }
      navigate("/customers");
    } catch (err) {
      console.error("Error adding customer:", err);
      setSubmitError("Error adding customer. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/customers")}>
        Back
      </button>
      <h1>Add New Customer</h1>
      {submitError && <p className={styles.error}>{submitError}</p>}
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter customer name"
            value={customer.name}
            onChange={handleChange}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={customer.email}
            onChange={handleChange}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            value={customer.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            placeholder="Enter address"
            value={customer.address}
            onChange={handleChange}
          ></textarea>
          {errors.address && <p className={styles.error}>{errors.address}</p>}
        </div>

        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            className={styles.saveBtn}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
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
