
import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Suppliers/suppliers.module.css";
import SearchBar from "../../components/SearchBar";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import { Link } from "react-router-dom";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");

    setSuppliers(JSON.parse(savedSuppliers));
    setLoading(false);
  }, []);

  

  const handleEditSupplier = (updatedSupplier) => {
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
    setIsEditModalOpen(false);
  };

  const handleDeleteSupplier = (id) => {
    const updatedSuppliers = suppliers.filter((supplier) => supplier.id !== id);
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
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
        <Link to={`/suppliers/add`}>
          <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Supplier</button>
        </Link>
        <SearchBar
          placeholder="Search suppliers..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {isEditModalOpen && <EditSupplierModal supplier={selectedSupplier} onSave={handleEditSupplier} onCancel={() => setIsEditModalOpen(false)} />}

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
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.address}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => {
                      setSelectedSupplier(supplier);
                      setIsEditModalOpen(true);
                    }}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
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

export default Suppliers;
