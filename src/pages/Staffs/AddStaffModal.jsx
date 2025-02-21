import React, { useState } from "react";
import styles from "../../styles/PageStyles/Staffs/addStaffModal.module.css";

const AddStaffModal = ({ onAddStaff, onCancel }) => {
  const [staff, setStaff] = useState({ name: "", email: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});

  const validate = (field, value) => {
    const newErrors = { ...errors };

    if (field === "name") {
      newErrors.name = value.trim() ? "" : "Name is required.";
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = !value.trim()
        ? "Email is required."
        : !emailRegex.test(value)
          ? "Invalid email format."
          : "";
    }

    if (field === "phone") {
      const indianPhoneRegex = /^[6789]\d{9}$/;
      newErrors.phone = !value.trim()
        ? "Phone number is required."
        : !indianPhoneRegex.test(value)
          ? "Enter a valid 10-digit Indian phone number."
          : "";
    }

    if (field === "address") {
      newErrors.address = value.trim() ? "" : "Address is required.";
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
    validate(name, value);
  };

  const handleSubmit = () => {
    // Run final validation check before saving
    Object.keys(staff).forEach((field) => validate(field, staff[field]));

    // If there are still errors, prevent submission
    if (Object.values(errors).some((error) => error)) return;

    onAddStaff({ ...staff });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New Staff</h3>

        <div className={styles.inputWrapper}>
          <input type="text" name="name" placeholder="Staff Name" value={staff.name} onChange={handleChange} />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.inputWrapper}>
          <input type="text" name="email" placeholder="Email" value={staff.email} onChange={handleChange} />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.inputWrapper}>
          <input type="text" name="phone" placeholder="Phone" value={staff.phone} onChange={handleChange} maxLength="10" />
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>

        <div className={styles.inputWrapper}>
          <input type="text" name="address" placeholder="Address" value={staff.address} onChange={handleChange} />
          {errors.address && <span className={styles.error}>{errors.address}</span>}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
