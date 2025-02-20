import React, { useState } from "react";
import styles from "../../styles/PageStyles/Inventory/addItemModal.module.css";

const AddCustomerModal = ({ onAddCustomer, onCancel }) => {
  const [customer, setCustomer] = useState({ name: "", category: "", quantity: "", priceperunit: "", supplier: "" });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      alert("Please fill in all required fields.")
      return;
    }
    onAddCustomer({ ...customer, phone: parseInt(customer.phone) });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New customer</h3>
        <input type="text" name="name" placeholder="Customer Name" onChange={handleChange} />
        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
        <input type="number" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
