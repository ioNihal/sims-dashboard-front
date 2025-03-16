import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/editItemPage.module.css";

const EditItemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID from the route
  const [updatedItem, setUpdatedItem] = useState(null);

  // On mount, retrieve the item from localStorage by id.
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
    const itemToEdit = storedItems.find(item => item.id.toString() === id);
    if (itemToEdit) {
      setUpdatedItem(itemToEdit);
    } else {
      alert("Item not found");
      navigate("/inventory");
    }
  }, [id, navigate]);

  const updateLocalStorage = (newItem) => {
    const storedItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
    const updatedItems = storedItems.map(item =>
      item.id.toString() === id ? newItem : item
    );
    localStorage.setItem("inventoryItems", JSON.stringify(updatedItems));
  };

  const handleChange = (e) => {
    // Only update quantity.
    setUpdatedItem({ ...updatedItem, quantity: e.target.value });
  };

  const handleSubmit = () => {
    if (updatedItem.quantity === "") {
      alert("Quantity cannot be empty!");
      return;
    }
    const newItem = { ...updatedItem, quantity: parseInt(updatedItem.quantity, 10) };
    updateLocalStorage(newItem);
    alert("Item updated successfully!");
    navigate("/inventory");
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  if (!updatedItem)
    return <div className={styles.pageContainer}>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backBtn} onClick={handleCancel}>
        Back
      </button>
      <h3>Edit Item</h3>
      <div className={styles.inputWrapper}>
        <label>Item Name</label>
        <input type="text" value={updatedItem.name} disabled />
      </div>
      <div className={styles.inputWrapper}>
        <label>Category</label>
        <input type="text" value={updatedItem.category} disabled />
      </div>
      <div className={styles.inputWrapper}>
        <label>Price per Unit</label>
        <input type="number" value={updatedItem.priceperunit} disabled />
      </div>
      <div className={styles.inputWrapper}>
        <label>Supplier</label>
        <input type="text" value={updatedItem.supplier} disabled />
      </div>
      <div className={styles.inputWrapper}>
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={updatedItem.quantity}
          onChange={handleChange}
        />
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
  );
};

export default EditItemPage;
