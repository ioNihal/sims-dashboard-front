import React, { useState } from "react";
import styles from "../../styles/PageStyles/Inventory/addItemModal.module.css";

const AddItemModal = ({ onAddItem, onCancel }) => {
  const [item, setItem] = useState({ name: "", category: "", quantity: "", priceperunit: "", supplier: "" });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!item.name || !item.category || !item.quantity || !item.priceperunit || !item.supplier) {
      alert("Please fill in all required fields.")
      return;
    }
    onAddItem({ ...item, quantity: parseInt(item.quantity) });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New Item</h3>
        <input type="text" name="name" placeholder="Item Name" onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />
        <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} />
        <input type="number" name="priceperunit" placeholder="Price per Unit" onChange={handleChange} />
        <input type="text" name="supplier" placeholder="Supplier" onChange={handleChange} />
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
