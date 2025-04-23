// src/pages/Inventory/Inventory.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/inventory.module.css";
import SearchBar from "../../components/SearchBar";
import { capitalize } from "../../utils/validators";
import RefreshButton from "../../components/RefreshButton";
import { getAllInventoryItems, deleteInventoryItem } from "../../api/inventory";
import FilterSortPanel from "../../components/FilterSortPanel";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const all = await getAllInventoryItems();
      setItems(all);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await deleteInventoryItem(id);
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting item");
    }
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "stockStatus") {
          const status =
            item.quantity > item.threshold
              ? "In Stock"
              : item.quantity > 0
                ? "Low Stock"
                : "Out of Stock";
          return status === value;
        }
        return item[key] === value;
      });

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      return sortOrder === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });


  return (
    <div className={styles.page}>
      <h1>Inventory</h1>
      <div className={styles.actions}>
        <button onClick={() => navigate("/inventory/add")} className={styles.addBtn}>
          Add Item
        </button>
        <div className={styles.rightSide}>
          <RefreshButton onClick={fetchItems} loading={loading} />
          <SearchBar
            placeholder="Search inventory..."
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
          />
          <FilterSortPanel
            filters={filters}
            setFilters={setFilters}
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterOptions={{
              category: [...new Set(items.map(i => i.category))],
              stockStatus: ["In Stock", "Low Stock", "Out of Stock"]
            }}
            sortOptions={[
              { key: "productName", label: "Name" },
              { key: "quantity", label: "Quantity" },
            ]}
          />
        </div>
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
                {/* <th>ID</th>*/}
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
                  {/* <td>ITEM{item._id.substring(5,10).toUpperCase()}</td> */}
                  <td>{capitalize(item.productName)}</td>
                  <td>{capitalize(item.category)}</td>
                  <td>{item.quantity}</td>
                  <td
                    className={
                      item.quantity > item.threshold
                        ? styles.inStock
                        : item.quantity > 0
                          ? styles.lowStock
                          : styles.outOfStock
                    }
                  >
                    {item.quantity > item.threshold
                      ? "In Stock"
                      : item.quantity > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                  </td>
                  <td>{capitalize(item.supplierName)}</td>
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