import React, { useState } from "react";
import styles from "../../styles/PageStyles/Staffs/editStaffModal.module.css";

const EditStaffModal = ({ staff, onSave, onCancel }) => {
  const [updatedStaff, setUpdatedStaff] = useState({ ...staff });
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
    setUpdatedStaff({ ...updatedStaff, [name]: value });
    validate(name, value);
  };

  const handleSubmit = () => {
    // Run final validation check before saving
    Object.keys(updatedStaff).forEach((field) => validate(field, updatedStaff[field]));

    // If there are still errors, prevent submission
    if (Object.values(errors).some((error) => error)) return;

    onSave({ ...updatedStaff });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Staff</h3>

        <div className={styles.inputWrapper}>
          <label>Staff Name</label>
          <input type="text" name="name" value={updatedStaff.name} onChange={handleChange} />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input type="text" name="email" value={updatedStaff.email} onChange={handleChange} />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input type="text" name="phone" value={updatedStaff.phone} onChange={handleChange} maxLength="10" />
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>

        <div className={styles.inputWrapper}>
          <label>Address</label>
          <input type="text" name="address" value={updatedStaff.address} onChange={handleChange} />
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

export default EditStaffModal;
