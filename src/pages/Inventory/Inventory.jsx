// src/pages/Inventory/Inventory.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/inventory.module.css";
import SearchBar from "../../components/SearchBar";
import RefreshButton from "../../components/RefreshButton";
import FilterSortPanel from "../../components/FilterSortPanel";
import { capitalize } from "../../utils/validators";
import { getAllInventoryItems, deleteInventoryItem } from "../../api/inventory";
import { toast } from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const all = await getAllInventoryItems();
      setItems(all || []);
    } catch (err) {
      toast.error(err.message || "Error fetching inventory items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventoryItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Item deleted");
    } catch (err) {
      toast.error(err.message || "Error deleting item");
    }
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const text = searchTerm.toLowerCase();
        const matchesSearch =
          item.productName.toLowerCase().includes(text) ||
          item.category.toLowerCase().includes(text) ||
          (item.supplierName || "").toLowerCase().includes(text);

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
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal === bVal) return 0;
        return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });
  }, [items, searchTerm, filters, sortKey, sortOrder]);

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
              category: [...new Set(items.map((i) => i.category))],
              stockStatus: ["In Stock", "Low Stock", "Out of Stock"],
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
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const supplier = item.supplierName || "Deleted supplier";
                const statusLabel =
                  item.quantity > item.threshold
                    ? "In Stock"
                    : item.quantity > 0
                    ? "Low Stock"
                    : "Out of Stock";
                return (
                  <tr key={item._id}>
                    <td>{capitalize(item.productName)}</td>
                    <td>{capitalize(item.category)}</td>
                    <td>{item.quantity}</td>
                    <td className={styles[statusLabel.replace(" ", "").toLowerCase()]}>
                      {statusLabel}
                    </td>
                    <td>{capitalize(supplier)}</td>
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
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setShowConfirm(true)}
                      >
                        Delete
                      </button>
                      {showConfirm && (
                      <ConfirmDialog
                        message="Sure you want to delete??"
                        onConfirm={() => {
                          setShowConfirm(false);
                          handleDeleteItem(item._id);
                        }}
                        onCancel={() => setShowConfirm(false)}
                      />
                    )}
                    </td>
                  </tr>
                );
              })}
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
