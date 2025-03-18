// src/pages/Staffs/AddStaffPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Staffs/addStaffPage.module.css";

const AddStaffPage = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    let error = "";
    if (field === "name") {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        error = "Name is required.";
      } else if (!/^[A-Za-z\s]+$/.test(trimmedValue)) {
        error = "Name can only contain letters and spaces.";
      }
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required.";
      else if (!emailRegex.test(value)) error = "Invalid email format.";
    }
    if (field === "phone") {
      const indianPhoneRegex = /^[6789]\d{9}$/;
      if (!value.trim()) error = "Phone number is required.";
      else if (!indianPhoneRegex.test(value))
        error = "Enter a valid 10-digit Indian phone number.";
    }
    if (field === "address") {
      error = value.trim() ? "" : "Address is required.";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
    // Validate immediately for real-time feedback
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = () => {
    // Build a new errors object for all fields
    const newErrors = {};
    Object.keys(staff).forEach((field) => {
      newErrors[field] = validateField(field, staff[field]);
    });
    setErrors(newErrors);

    // If any error exists, do not proceed.
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Check for duplicate email
    const savedStaffs = JSON.parse(localStorage.getItem("staffs") || "[]");
    const duplicate = savedStaffs.some(
      (s) => s.email.toLowerCase() === staff.email.toLowerCase()
    );
    if (duplicate) {
      setErrors((prev) => ({ ...prev, email: "Email is already in use." }));
      return;
    }

    // Save the new staff in localStorage
    const updatedStaffs = [
      ...savedStaffs,
      { ...staff, id: Date.now(), status: "Active" },
    ];
    localStorage.setItem("staffs", JSON.stringify(updatedStaffs));
    alert("Staff added successfully!");
    navigate("/staffs");
  };

  const handleCancel = () => {
    navigate("/staffs");
  };

  return (
    <div className={styles.page}>
      <h1>Add New Staff</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Staff Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter staff name"
            value={staff.name}
            onChange={handleChange}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter email"
            value={staff.email}
            onChange={handleChange}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Enter phone number"
            value={staff.phone}
            onChange={handleChange}
            maxLength="10"
          />
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Enter address"
            value={staff.address}
            onChange={handleChange}
          />
          {errors.address && (
            <span className={styles.error}>{errors.address}</span>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffPage;
