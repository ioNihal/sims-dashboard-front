
import React, { useState } from "react";
import styles from "../../styles/PageStyles/Suppliers/addSupplierModal.module.css";

const AddSupplierModal = ({ onAddSupplier, onCancel }) => {
  const [supplier, setSupplier] = useState({ name: "", email: "", phone: "", address: "" });

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!supplier.name || !supplier.email || !supplier.phone || !supplier.address) {
      alert("Please fill in all required fields.");
      return;
    }
    onAddSupplier({ ...supplier });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New Supplier</h3>
        <input type="text" name="name" placeholder="Supplier Name" onChange={handleChange} />
        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierModal;
