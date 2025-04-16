// src/pages/Inventory/Inventory.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/inventory.module.css";
import SearchBar from "../../components/SearchBar";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch inventory items from backend API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/inventory/");
        const data = await res.json();
        if (data) {
          setItems(data.inventory || []);
        }
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://suims.vercel.app/api/inventory/${id}`, { 
        method: "DELETE" 
      });
      if (!res.ok) {
        throw new Error("Failed to delete item");
      }
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting item");
    }
  };

  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <h1>Inventory</h1>
      <div className={styles.actions}>
        <Link to="/inventory/add" className={styles.addBtn}>
          Add Item
        </Link>
        <SearchBar
          className={styles.searchBar}
          placeholder="Search inventory..."
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
        />
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading inventory...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.productName}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td
                    className={
                      item.quantity > 50
                        ? styles.inStock
                        : item.quantity > 0
                          ? styles.lowStock
                          : styles.outOfStock
                    }
                  >
                    {item.quantity > 50
                      ? "In Stock"
                      : item.quantity > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                  </td>
                  <td>{item.supplierName}</td>
                  <td>
                    <Link to={`/inventory/${item._id}`}>
                      <button className={styles.viewBtn}>View</button>
                    </Link>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/inventory/edit/${item._id}`)}
                    >
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteItem(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className={styles.noResults}>
                    No items in Inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;