// src/pages/Customers/AddCustomerPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Customers/addCustomerPage.module.css";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
} from "../../utils/validators";
import { addCustomer } from "../../api/customers";
import toast from "react-hot-toast";

const AddCustomerPage = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentPreference: "weekly",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentPreference: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    let error = "";
    if (name === "name") error = validateName(value);
    if (name === "email") error = validateEmail(value);
    if (name === "phone") error = validatePhone(value);
    if (name === "address") error = validateAddress(value);
    if (name === "paymentPreference") error = value ? "" : "Select preference";
    setErrors((prev) => ({ ...prev, [name]: error }));
    // if (error) toast.error(error);
  };

  const validateAll = () => {
    const eName = validateName(customer.name);
    const eEmail = validateEmail(customer.email);
    const ePhone = validatePhone(customer.phone);
    const eAddr = validateAddress(customer.address);
    const ePref = customer.paymentPreference ? "" : "Select preference";
    const all = { name: eName, email: eEmail, phone: ePhone, address: eAddr, paymentPreference: ePref };
    setErrors(all);
    const firstErr = Object.values(all).find((m) => m);
    if (firstErr) toast.error(firstErr);
    return !firstErr;
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setIsSaving(true);
    try {
      await addCustomer(customer);
      toast.success("Customer added");
      navigate("/customers");
    } catch (err) {
      toast.error(err.message || "Failed to add customer");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/customers")}>Back</button>
      <h1>Add New Customer</h1>
      <div className={styles.form}>
        {[
          ["name", "Customer Name", customer.name],
          ["email", "Email", customer.email],
          ["phone", "Phone", customer.phone]
        ].map(([field, label, val]) => (
          <div key={field} className={styles.inputGroup}>
            <label htmlFor={field}>{label}</label>
            <input id={field} name={field} value={val} onChange={handleChange} />
            {errors[field] && <p className={styles.error}>{errors[field]}</p>}
          </div>
        ))}
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="address">Address</label>
          <textarea id="address" name="address" value={customer.address} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>Payment Preference</label>
          {['weekly', 'monthly'].map(pref => (
            <label key={pref}>
              <input type="radio" name="paymentPreference" value={pref} checked={customer.paymentPreference === pref} onChange={handleChange} /> {pref}
            </label>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            className={styles.saveBtn}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => navigate("/customers")} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerPage;
