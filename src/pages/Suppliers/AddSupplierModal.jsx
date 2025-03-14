
import React, { useEffect, useState } from "react";
import styles from "../../styles/PageStyles/Suppliers/addSupplierModal.module.css";

const AddSupplierModal = ({ onAddSupplier, onCancel }) => {
  const [supplier, setSupplier] = useState({ name: "", email: "", phone: "", address: "" });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    setSuppliers(JSON.parse(savedSuppliers));
  }, []);

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleAddSupplier = (newSupplier) => {
    const emailExists = suppliers.some(supplier => supplier.email === newSupplier.email);

    if (emailExists) {
      alert("This email is already in use. Please use a different email.");
      return;
    }

    const updatedSuppliers = [...suppliers, { ...newSupplier, id: Date.now() }];
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplier.name || !supplier.email || !supplier.phone || !supplier.address) {
      alert("Please fill in all required fields.");
      return;
    }
    handleAddSupplier({ ...supplier });
  };



  return (
    <div className={styles.page}>
      <h3>Add New Supplier</h3>
      <form className={styles.formContainer}>
        <div className={styles.inputWrapper}>
          <label>Supplier Name</label>
          <input type="text" name="name" placeholder="Business name" onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input type="text" name="email" placeholder="johndoe@example.com" onChange={handleChange} />
        </div>

        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input type="text" name="phone" placeholder="10 digit phone number" onChange={handleChange} />
        </div>

        <div className={`${styles.inputWrapper} ${styles.fullWidth}`}>
          <label>Address</label>
          <textarea name="address" placeholder="Business Address" onChange={handleChange} />
        </div>


        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierModal;
