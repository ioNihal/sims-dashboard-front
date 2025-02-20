import React, { useState } from "react";
import styles from "../../styles/PageStyles/Customers/editCustomerModal.module.css";

const EditCustomerModal = ({ customer, onSave, onCancel }) => {
  const [updatedCustomer, setUpdatedCustomer] = useState({ ...customer });

  const handleChange = (e) => {
    setUpdatedCustomer({ ...updatedCustomer, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!updatedCustomer.name || !updatedCustomer.email || !updatedCustomer.phone || !updatedCustomer.address) {
      alert("Fields cannot be empty!")
      return;
    }
    onSave({ ...updatedCustomer });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Customer</h3>
        <div className={styles.inputWrapper}>
          <label>Customer Name</label>
          <input type="text" name="name" value={updatedCustomer.name} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input type="text" name="email" value={updatedCustomer.email} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input type="text" name="phone" value={updatedCustomer.phone} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Address</label>
          <input type="text" name="address" value={updatedCustomer.address} onChange={handleChange} />
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
