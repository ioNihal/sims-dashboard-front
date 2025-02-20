import React, { useState } from "react";
import styles from "../../styles/PageStyles/Suppliers/editSupplierModal.module.css";

const EditSupplierModal = ({ supplier, onSave, onCancel }) => {
  const [updatedSupplier, setUpdatedSupplier] = useState({ ...supplier });

  

  const handleChange = (e) => {
    setUpdatedSupplier({ ...updatedSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!updatedSupplier.name || !updatedSupplier.email || !updatedSupplier.phone || !updatedSupplier.address) {
      alert("Fields cannot be empty!");
      return;
    }
    onSave({ ...updatedSupplier });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Supplier</h3>
        <div className={styles.inputWrapper}>
          <label>Supplier Name</label>
          <input type="text" name="name" value={updatedSupplier.name} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input type="text" name="email" value={updatedSupplier.email} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input type="text" name="phone" value={updatedSupplier.phone} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Address</label>
          <input type="text" name="address" value={updatedSupplier.address} onChange={handleChange} />
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierModal;
