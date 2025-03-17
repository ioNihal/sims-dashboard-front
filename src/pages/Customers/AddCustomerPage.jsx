import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generatePassword } from "../../utils/passwordUtils";
import styles from "../../styles/PageStyles/Customers/addCustomerPage.module.css";

const AddCustomerPage = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
  const navigate = useNavigate();

  // Generate password on component mount
  useEffect(() => {
    const newPassword = generatePassword();
    setCustomer((prev) => ({ ...prev, password: newPassword }));
  }, []);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      alert("Please fill in all required fields.");
      return;
    }

    // Retrieve existing customers and add the new one
    const savedCustomers = localStorage.getItem("customers")
      ? JSON.parse(localStorage.getItem("customers"))
      : [];
    const updatedCustomers = [
      ...savedCustomers,
      { ...customer, id: Date.now() }
    ];
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));

    // Navigate back to the customers list after saving
    navigate("/customers");
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className={styles.container}>
      <h1>Add New Customer</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter customer name"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Generated Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={customer.password}
            disabled
          />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerPage;
