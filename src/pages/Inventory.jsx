import React, { useState } from "react";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";
import styles from "../styles/PageStyles/InventoryStyles/inventory.module.css";
import SearchBar from "../components/SearchBar";

const Inventory = () => {

  const [items, setItems] = useState([
    { id: 1, name: "Parle-G Biscuits", category: "Snacks", quantity: 100, priceperunit: 10, supplier: "Parle Products" },
    { id: 2, name: "Britannia Bread", category: "Bakery", quantity: 50, priceperunit: 40, supplier: "Britannia Industries" },
    { id: 3, name: "Amul Butter", category: "Dairy", quantity: 30, priceperunit: 55, supplier: "Amul" },
    { id: 4, name: "Tata Salt", category: "Grocery", quantity: 80, priceperunit: 28, supplier: "Tata Consumer Products" },
    { id: 5, name: "Aashirvaad Atta", category: "Grocery", quantity: 60, priceperunit: 320, supplier: "ITC Limited" },
    { id: 6, name: "Red Label Tea", category: "Beverages", quantity: 40, priceperunit: 150, supplier: "Hindustan Unilever" },
    { id: 7, name: "Nescafé Coffee", category: "Beverages", quantity: 25, priceperunit: 200, supplier: "Nestlé India" },
    { id: 8, name: "Colgate Toothpaste", category: "Personal Care", quantity: 70, priceperunit: 99, supplier: "Colgate-Palmolive" },
    { id: 9, name: "Dettol Soap", category: "Personal Care", quantity: 90, priceperunit: 40, supplier: "Reckitt Benckiser" },
    { id: 10, name: "Patanjali Honey", category: "Grocery", quantity: 35, priceperunit: 199, supplier: "Patanjali Ayurved" },
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
      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Item</button>
        <SearchBar className={styles.searchBar} placeholder="Search inventory..." searchQuery={searchTerm} setSearchQuery={setSearchTerm} />
      </div>

      {isAddModalOpen && <AddItemModal onAddItem={handleAddItem} onCancel={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <EditItemModal item={selectedItem} onSave={handleEditItem} onCancel={() => setIsEditModalOpen(false)} />}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
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
                {item.quantity > 50 ? "In Stock" : item.quantity > 0 ? "Low Stock" : "Out of Stock"}
              </td>
              <td>{item.supplier}</td>
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
