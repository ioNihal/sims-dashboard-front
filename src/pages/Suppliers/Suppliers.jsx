
import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Suppliers/suppliers.module.css";
import SearchBar from "../../components/SearchBar";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
      setLoading(false);
    } else {
      const suppliersData = [
        { "id": 1, "name": "Hindustan Unilever Limited", "email": "contact@hul.com", "phone": "022-3983-0000", "address": "HUL House, Andheri East, Mumbai, Maharashtra", "status": "Active" },
        { "id": 2, "name": "ITC Limited", "email": "info@itc.in", "phone": "033-2288-9371", "address": "Virginia House, Kolkata, West Bengal", "status": "Active" },
        { "id": 3, "name": "Nestlé India", "email": "consumer.services@in.nestle.com", "phone": "0124-394-0000", "address": "Nestlé House, Gurgaon, Haryana", "status": "Active" },
        { "id": 4, "name": "Britannia Industries", "email": "consumer@britindia.com", "phone": "080-3768-9999", "address": "Britannia House, Bangalore, Karnataka", "status": "Active" },
        { "id": 5, "name": "Amul (Gujarat Cooperative Milk Marketing Federation)", "email": "info@amul.coop", "phone": "02692-258506", "address": "Amul Dairy Road, Anand, Gujarat", "status": "Active" },
        { "id": 6, "name": "Parle Products", "email": "consumer@parleproducts.com", "phone": "022-6691-6911", "address": "Vile Parle, Mumbai, Maharashtra", "status": "Active" },
        { "id": 7, "name": "Tata Consumer Products", "email": "customercare@tataconsumer.com", "phone": "1800-345-1725", "address": "Kolkata, West Bengal", "status": "Active" },
        { "id": 8, "name": "Colgate-Palmolive India", "email": "consumer_affairs@colpal.com", "phone": "1800-225-599", "address": "Colgate Research Centre, Mumbai, Maharashtra", "status": "Active" },
        { "id": 9, "name": "Reckitt Benckiser India", "email": "care@rb.com", "phone": "1800-103-8873", "address": "DLF Plaza Tower, Gurgaon, Haryana", "status": "Active" },
        { "id": 10, "name": "Patanjali Ayurved", "email": "customercare@patanjaliayurved.org", "phone": "1800-180-4108", "address": "Patanjali Yogpeeth, Haridwar, Uttarakhand", "status": "Active" },
        { "id": 11, "name": "Marico Limited", "email": "consumer@marico.com", "phone": "022-6648-0480", "address": "Kanjurmarg, Mumbai, Maharashtra", "status": "Active" },
        { "id": 12, "name": "Dabur India Limited", "email": "care@dabur.com", "phone": "0120-396-2100", "address": "Kaushambi, Ghaziabad, Uttar Pradesh", "status": "Active" },
        { "id": 13, "name": "Godrej Consumer Products", "email": "care@godrejcp.com", "phone": "022-2518-8010", "address": "Godrej One, Vikhroli, Mumbai, Maharashtra", "status": "Active" },
        { "id": 14, "name": "Emami Limited", "email": "contact@emamigroup.com", "phone": "033-6613-6264", "address": "Emami Tower, Kolkata, West Bengal", "status": "Active" },
        { "id": 15, "name": "Nivea India (Beiersdorf AG)", "email": "consumer.care@nivea.in", "phone": "1800-103-7315", "address": "Mumbai, Maharashtra", "status": "Active" }
      ];
      setTimeout(() => {
        setSuppliers(suppliersData);
        localStorage.setItem("suppliers", JSON.stringify(suppliersData));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddSupplier = (newSupplier) => {
    const emailExists = suppliers.some(supplier => supplier.email === newSupplier.email);

    if (emailExists) {
      alert("This email is already in use. Please use a different email.");
      return;
    }

    const updatedSuppliers = [...suppliers, { ...newSupplier, id: Date.now() }];
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
    setIsAddModalOpen(false);
  };

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
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Supplier</button>
        <SearchBar
          placeholder="Search suppliers..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {isAddModalOpen && <AddSupplierModal onAddSupplier={handleAddSupplier} onCancel={() => setIsAddModalOpen(false)} />}
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
