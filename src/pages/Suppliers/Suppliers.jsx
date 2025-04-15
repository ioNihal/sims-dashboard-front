// src/pages/Suppliers/Suppliers.jsx

import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Suppliers/suppliers.module.css";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";
import { capitalize } from "../../utils/validators";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/supplier/");
        const data = await res.json();
        const supplierArray = data.supplier || data;
        // Map _id to id for consistency
        const formattedSuppliers = supplierArray.map((s) => ({
          ...s,
          id: s._id,
        }));
        setSuppliers(formattedSuppliers);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDeleteSupplier = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://suims.vercel.app/api/supplier/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Error deleting supplier");
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      <h1>Suppliers</h1>
      <div className={styles.actions}>
        <Link to="/suppliers/add">
          <button className={styles.addBtn}>Add Supplier</button>
        </Link>
        <SearchBar
          placeholder="Search suppliers..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading suppliers...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{`SU${supplier.id.substring(8, 12).toUpperCase()}`}</td>
                  <td>{capitalize(supplier.name)}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.address}</td>
                  <td>
                    <Link to={`/suppliers/view/${supplier.id}`}>
                      <button className={styles.viewBtn}>View</button>
                    </Link>
                    <Link to={`/suppliers/edit/${supplier.id}`}>
                      <button className={styles.editBtn}>Edit</button>
                    </Link>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteSupplier(supplier.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.noResults}>
                    No suppliers found.
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

export default Suppliers;
