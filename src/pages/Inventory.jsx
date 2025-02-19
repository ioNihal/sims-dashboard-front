import React, { useState } from "react";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";
import styles from "../styles/PageStyles/InventoryStyles/inventory.module.css";

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Laptop", category: "Electronics", quantity: 10 },
    { id: 2, name: "Headphones", category: "Accessories", quantity: 0 },
    { id: 3, name: "Keyboard", category: "Peripherals", quantity: 15 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddItem = (newItem) => {
    setItems([...items, { ...newItem, id: items.length + 1 }]);
    setIsAddModalOpen(false);
  };

  const handleEditItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2>Inventory</h2>
      <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Item</button>
      <input
        type="text"
        placeholder="Search inventory..."
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isAddModalOpen && <AddItemModal onAddItem={handleAddItem} onCancel={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <EditItemModal item={selectedItem} onSave={handleEditItem} onCancel={() => setIsEditModalOpen(false)} />}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
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
              <td className={item.quantity > 0 ? styles.inStock : styles.outOfStock}>
                {item.quantity > 0 ? "In Stock" : "Out of Stock"}
              </td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
