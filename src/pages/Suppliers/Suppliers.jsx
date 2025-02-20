
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
        { id: 1, name: "Hindustan FMCG Supplies", email: "hindustan.fmcg@example.com", phone: "011-2345-6789", address: "12 Connaught Place, New Delhi", status: "Active" },
        { id: 2, name: "Bharat FMCG Traders", email: "bharat.traders@example.com", phone: "022-3456-7890", address: "45 MG Road, Mumbai, Maharashtra", status: "Active" },
        { id: 3, name: "Desi Foods Distribution", email: "desi.foods@example.com", phone: "044-5678-1234", address: "78 T. Nagar, Chennai, Tamil Nadu", status: "Active" },
        { id: 4, name: "Spice Route FMCG", email: "spiceroute.fmcg@example.com", phone: "080-1234-5678", address: "89 Brigade Road, Bangalore, Karnataka", status: "Inactive" },
        { id: 5, name: "Royal FMCG Suppliers", email: "royal.fmcg@example.com", phone: "033-2345-6789", address: "23 Salt Lake, Kolkata, West Bengal", status: "Active" },
        { id: 6, name: "Swadeshi FMCG Distributors", email: "swadeshi.fmcg@example.com", phone: "079-9876-5432", address: "56 Banjara Hills, Hyderabad, Telangana", status: "Inactive" },
        { id: 7, name: "Omkar FMCG Wholesale", email: "omkar.fmcg@example.com", phone: "011-8765-4321", address: "34 Connaught Place, New Delhi", status: "Active" },
        { id: 8, name: "Saffron FMCG Exports", email: "saffron.exports@example.com", phone: "044-3456-7890", address: "90 Kilpauk, Chennai, Tamil Nadu", status: "Active" },
        { id: 9, name: "Vijay FMCG Distributors", email: "vijay.fmcg@example.com", phone: "080-9876-1234", address: "67 Indiranagar, Bangalore, Karnataka", status: "Inactive" },
        { id: 10, name: "Prerna FMCG Supplies", email: "prerna.fmcg@example.com", phone: "033-5678-1234", address: "12 Park Street, Kolkata, West Bengal", status: "Active" },
        { id: 11, name: "Rajasthan FMCG Traders", email: "rajasthan.fmcg@example.com", phone: "0151-2345-6789", address: "15 Johri Bazaar, Jaipur, Rajasthan", status: "Active" },
        { id: 12, name: "Ganga FMCG Distributors", email: "ganga.fmcg@example.com", phone: "0512-3456-7890", address: "101 MG Road, Kolkata, West Bengal", status: "Inactive" },
        { id: 13, name: "Suryodaya FMCG Supplies", email: "suryodaya.fmcg@example.com", phone: "079-1234-5678", address: "65 Residency Road, Hyderabad, Telangana", status: "Active" },
        { id: 14, name: "Dharma FMCG Wholesale", email: "dharma.fmcg@example.com", phone: "044-7890-1234", address: "77 Anna Salai, Chennai, Tamil Nadu", status: "Active" },
        { id: 15, name: "Mitra FMCG Traders", email: "mitra.fmcg@example.com", phone: "022-8765-4321", address: "88 Bandra, Mumbai, Maharashtra", status: "Inactive" },
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
