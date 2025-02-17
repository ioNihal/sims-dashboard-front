// pages/Inventory.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/PageStyles/InventoryStyles/inventory.module.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching inventory data (replace with real API calls later)
  useEffect(() => {
    const sampleItems = [
      {
        id: 1,
        name: "Item A",
        barcode: "123456789012",
        category: "Category 1",
        quantity: 50,
        price: 10.0,
        expiry_date: "2025-12-31",
        supplier: { name: "Supplier X", contact: "1234567890" },
        last_updated: "2025-01-01"
      },
      {
        id: 2,
        name: "Item B",
        barcode: "987654321098",
        category: "Category 2",
        quantity: 20,
        price: 20.0,
        expiry_date: "2025-10-31",
        supplier: { name: "Supplier Y", contact: "0987654321" },
        last_updated: "2025-02-15"
      },
      // Add more sample items as needed
    ];

    setTimeout(() => {
      setItems(sampleItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddItem = () => {
    console.log('Add item button clicked');
    // Add your logic to add a new inventory item (e.g., show a modal or navigate to an add item page)
  };

  const handleEditItem = (itemId) => {
    console.log('Edit item with id:', itemId);
    // Add your logic to edit an inventory item
  };

  const handleDeleteItem = (itemId) => {
    console.log('Delete item with id:', itemId);
    // Add your logic to delete an inventory item
  };

  return (
    <div className={styles.page}>
      <h1>Inventory</h1>
      <p>This is where inventory management details will be displayed.</p>
      <button className={styles.addBtn} onClick={handleAddItem}>
        Add Item
      </button>
      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.barcode}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.expiry_date}</td>
                  <td>
                    {item.supplier.name} <br /> ({item.supplier.contact})
                  </td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.editBtn}`}
                      onClick={() => handleEditItem(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.btn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
