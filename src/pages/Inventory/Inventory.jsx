import React, { useEffect, useState } from "react";
import styles from "../../styles/PageStyles/Inventory/inventory.module.css";
import SearchBar from "../../components/SearchBar";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedItems = localStorage.getItem("inventoryItems");

    if (storedItems) {
      setItems(JSON.parse(storedItems));
      setLoading(false);
    } else {
      const sampleItems = [
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
      ];

      setTimeout(() => {
        setItems(sampleItems);
        localStorage.setItem("inventoryItems", JSON.stringify(sampleItems));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const updateLocalStorage = (updatedItems) => {
    setItems(updatedItems);
    localStorage.setItem("inventoryItems", JSON.stringify(updatedItems));
  };

  const handleAddItem = (newItem) => {
    const updatedItems = [...items, { ...newItem, id: Date.now() }];
    updateLocalStorage(updatedItems);
    setIsAddModalOpen(false);
  };

  const handleEditItem = (updatedItem) => {
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateLocalStorage(updatedItems);
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    updateLocalStorage(updatedItems);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <h1>Inventory</h1>
      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Item</button>
        <SearchBar className={styles.searchBar} placeholder="Search inventory..." searchQuery={searchTerm} setSearchQuery={setSearchTerm} />
      </div>

      {isAddModalOpen && <AddItemModal onAddItem={handleAddItem} onCancel={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <EditItemModal item={selectedItem} onSave={handleEditItem} onCancel={() => setIsEditModalOpen(false)} />}

      {
        loading ? (
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
        )}
    </div>
  );
};

export default Inventory;
