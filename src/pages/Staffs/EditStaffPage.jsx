import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Staffs/editStaffPage.module.css";

const EditStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updatedStaff, setUpdatedStaff] = useState(null);
  const [errors, setErrors] = useState({});

  // Load staff from localStorage based on id parameter
  useEffect(() => {
    const savedStaffs = localStorage.getItem("staffs");
    if (savedStaffs) {
      const staffs = JSON.parse(savedStaffs);
      const staffToEdit = staffs.find(
        (staff) => String(staff.id) === id
      );
      if (staffToEdit) {
        setUpdatedStaff(staffToEdit);
      } else {
        alert("Staff not found");
        navigate("/staffs");
      }
    } else {
      alert("No staffs available");
      navigate("/staffs");
    }
  }, [id, navigate]);

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
    setUpdatedStaff((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = () => {
    // Build new errors object for all fields
    const newErrors = {};
    Object.keys(updatedStaff).forEach((field) => {
      newErrors[field] = validateField(field, updatedStaff[field]);
    });
    setErrors(newErrors);

    // If any error exists, prevent submission.
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Check for duplicate email: any other staff with same email (ignoring case)
    const savedStaffs = JSON.parse(localStorage.getItem("staffs") || "[]");
    const duplicate = savedStaffs.some(
      (staff) =>
        String(staff.id) !== id &&
        staff.email.toLowerCase() === updatedStaff.email.toLowerCase()
    );
    if (duplicate) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is already in use by another staff.",
      }));
      return;
    }

    // Update staff in localStorage
    const updatedStaffs = savedStaffs.map((staff) =>
      String(staff.id) === id ? updatedStaff : staff
    );
    localStorage.setItem("staffs", JSON.stringify(updatedStaffs));
    alert("Staff updated successfully!");
    navigate("/staffs");
  };

  const handleCancel = () => {
    navigate("/staffs");
  };

  if (!updatedStaff) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <h1>Edit Staff</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Staff Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={updatedStaff.name}
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
            value={updatedStaff.email}
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
            value={updatedStaff.phone}
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
            value={updatedStaff.address}
            onChange={handleChange}
          />
          {errors.address && <span className={styles.error}>{errors.address}</span>}
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

export default EditStaffPage;
