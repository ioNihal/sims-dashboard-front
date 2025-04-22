// src/pages/Customers/EditCustomerPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/editCustomerPage.module.css";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
} from "../../utils/validators";
import { getCustomerById, updateCustomer } from "../../api/customers";

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to hold the customer's data
  const [updatedCustomer, setUpdatedCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  // Field-specific errors for live validation
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  // Global error for fetch or submission failures
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the customer's current data on mount
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await getCustomerById(id);
        setUpdatedCustomer({
          name: customerData.name || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          address: customerData.address || "",
        });
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setSubmitError("Error fetching customer data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // Live validation as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...updatedCustomer, [name]: value };
    setUpdatedCustomer(updatedData);

    // Validate the field that changed
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

  // Validate all fields before submitting the form
  const validateFields = () => {
    const nameError = validateName(updatedCustomer.name);
    const emailError = validateEmail(updatedCustomer.email);
    const phoneError = validatePhone(updatedCustomer.phone);
    const addressError = validateAddress(updatedCustomer.address);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      address: addressError,
    });

    return !(nameError || emailError || phoneError || addressError);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitError("");
    if (!validateFields()) {
      return;
    }

    setIsSaving(true);
    try {
      await updateCustomer(id, updatedCustomer)
      setIsSaving(false);
      navigate("/customers");
    } catch (err) {
      console.error("Error updating customer:", err);
      setSubmitError("Error updating customer. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/customers")}>
        Back
      </button>
      <h1>Edit Customer</h1>
      {submitError && <p className={styles.error}>{submitError}</p>}
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter customer name"
            value={updatedCustomer.name}
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
            value={updatedCustomer.email}
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
            value={updatedCustomer.phone}
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
            value={updatedCustomer.address}
            onChange={handleChange}
          ></textarea>
          {errors.address && <p className={styles.error}>{errors.address}</p>}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
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

export default EditCustomerPage;
