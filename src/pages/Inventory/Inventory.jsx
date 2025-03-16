import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/inventory.module.css";
import SearchBar from "../../components/SearchBar";
import EditItemModal from "./EditItemPage";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = localStorage.getItem("inventoryItems");

    if (storedItems) {
      setItems(JSON.parse(storedItems));
      setLoading(false);
    }
    // Optionally, you can include default sample items here if needed.
    // Remove or update the setTimeout block if you don't need sampleItems.
  }, []);

  const updateLocalStorage = (updatedItems) => {
    setItems(updatedItems);
    localStorage.setItem("inventoryItems", JSON.stringify(updatedItems));
  };

  const handleEditItem = (updatedItem) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    updateLocalStorage(updatedItems);
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    updateLocalStorage(updatedItems);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
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

      {isEditModalOpen && (
        <EditItemModal
          item={selectedItem}
          onSave={handleEditItem}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

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
                <th>Price / Unit</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.priceperunit}</td>
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
                  <td>{item.supplier}</td>
                  <td>
                    <Link to={`/inventory/${item.id}`}>
                      <button className={styles.viewBtn}>View</button>
                    </Link>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        navigate(`/inventory/edit/${item.id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
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
