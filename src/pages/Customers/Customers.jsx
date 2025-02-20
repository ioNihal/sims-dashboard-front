// pages/Customers.js
import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Customers/customers.module.css";
import SearchBar from "../../components/SearchBar";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
      setLoading(false);
    } else {
      const customers = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", address: "123 Main St", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", address: "456 Oak St", status: "Inactive" },
        { id: 3, name: "Alice Brown", email: "alice@example.com", phone: "555-678-1234", address: "789 Pine St", status: "Active" },
        { id: 4, name: "Arun Kumar", email: "arun.kumar@example.com", phone: "944-123-4567", address: "MG Road, Kochi, Kerala", status: "Active" },
        { id: 5, name: "Meera Nair", email: "meera.nair@example.com", phone: "984-567-8901", address: "Trivandrum, Kerala", status: "Inactive" },
        { id: 6, name: "Ravi Menon", email: "ravi.menon@example.com", phone: "987-654-4321", address: "Calicut, Kerala", status: "Active" },
        { id: 7, name: "Lakshmi Pillai", email: "lakshmi.p@example.com", phone: "963-852-7410", address: "Kottayam, Kerala", status: "Active" },
        { id: 8, name: "Suresh Balan", email: "suresh.balan@example.com", phone: "900-123-9876", address: "Ernakulam, Kerala", status: "Inactive" },
        { id: 9, name: "Anjali Raj", email: "anjali.raj@example.com", phone: "811-223-4455", address: "Thrissur, Kerala", status: "Active" },
        { id: 10, name: "Vishnu Das", email: "vishnu.das@example.com", phone: "889-556-2233", address: "Palakkad, Kerala", status: "Inactive" },
        { id: 11, name: "Reshma K", email: "reshma.k@example.com", phone: "807-332-1199", address: "Alappuzha, Kerala", status: "Active" },
        { id: 12, name: "Manoj Varma", email: "manoj.varma@example.com", phone: "812-667-3344", address: "Kannur, Kerala", status: "Inactive" },
        { id: 13, name: "Deepak R", email: "deepak.r@example.com", phone: "909-876-5432", address: "Kasaragod, Kerala", status: "Active" },
        { id: 14, name: "Neha Thomas", email: "neha.thomas@example.com", phone: "798-665-4321", address: "Kollam, Kerala", status: "Inactive" },
        { id: 15, name: "Prakash Iyer", email: "prakash.iyer@example.com", phone: "701-998-7766", address: "Malappuram, Kerala", status: "Active" },
      ];
      setTimeout(() => {
        setCustomers(customers);
        localStorage.setItem("customers", JSON.stringify(customers));
        setLoading(false);
      }, 1000);
    }
  }, []);


  const handleAddCustomer = (newCustomer) => {
    const emailExists = customers.some(customer => customer.email === newCustomer.email);

    if (emailExists) {
      alert("This email is already in use. Please use a different email.");
      return;
    }

    const updatedCustomers = [...customers, { ...newCustomer, id: Date.now() }];
    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setIsAddModalOpen(false);
  };


  const handleEditCustomer = (updatedCustomer) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setIsEditModalOpen(false);
  };

  const handleDeleteCustomer = (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      <h1>Customers</h1>

      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Customer</button>
        <SearchBar
          placeholder="Search customers..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {isAddModalOpen && <AddCustomerModal onAddCustomer={handleAddCustomer} onCancel={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <EditCustomerModal customer={selectedCustomer} onSave={handleEditCustomer} onCancel={() => setIsEditModalOpen(false)} />}

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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>
                    <button className={styles.editBtn} onClick={() => {
                      setSelectedCustomer(customer);
                      setIsEditModalOpen(true);
                    }}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
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

export default Customers;
