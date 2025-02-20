import React, { useState } from "react";
import styles from "../../styles/PageStyles/Inventory/editItemModal.module.css";

const EditItemModal = ({ item, onSave, onCancel }) => {
  const [updatedItem, setUpdatedItem] = useState({ ...item });

  const handleChange = (e) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!updatedItem.name || !updatedItem.category || updatedItem.quantity === "" || !updatedItem.priceperunit || !updatedItem.supplier) {
      alert("Fields cannot be empty!")
      return;}
    onSave({ ...updatedItem, quantity: parseInt(updatedItem.quantity) });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Item</h3>
        <div className={styles.inputWrapper}>
          <label>Item Name</label>
          <input type="text" name="name" value={updatedItem.name} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Category</label>
          <input type="text" name="category" value={updatedItem.category} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Quantity</label>
          <input type="number" name="quantity" value={updatedItem.quantity} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Price per Unit</label>
          <input type="number" name="priceperunit" value={updatedItem.priceperunit} onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Supplier</label>
          <input type="text" name="supplier" value={updatedItem.supplier} onChange={handleChange} />
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
