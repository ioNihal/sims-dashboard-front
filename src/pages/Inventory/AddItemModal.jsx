import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Inventory/addItemModal.module.css";

const AddItemModal = ({ onAddItem, onCancel }) => {
  const [item, setItem] = useState({
    name: "",
    category: "",
    quantity: "",
    priceperunit: "",
    supplier: "",
  });
  const [suppliers, setSuppliers] = useState([]);

  // Retrieve suppliers from localStorage on component mount.
  useEffect(() => {
    const suppliersData = JSON.parse(localStorage.getItem("suppliers")) || [];
    setSuppliers(suppliersData);
  }, []);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Validate required fields.
    if (
      !item.name ||
      !item.category ||
      !item.quantity ||
      !item.priceperunit ||
      !item.supplier
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Call the onAddItem callback with the new item.
    onAddItem({ ...item, quantity: parseInt(item.quantity) });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New Item</h3>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          onChange={handleChange}
          value={item.name}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          value={item.category}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          onChange={handleChange}
          value={item.quantity}
        />
        <input
          type="number"
          name="priceperunit"
          placeholder="Price per Unit"
          onChange={handleChange}
          value={item.priceperunit}
        />
        {/* Supplier dropdown */}
        <select
          name="supplier"
          onChange={handleChange}
          value={item.supplier}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
