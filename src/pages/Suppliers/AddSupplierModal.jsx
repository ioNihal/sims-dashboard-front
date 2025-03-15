import React, { useEffect, useState } from "react";
import styles from "../../styles/PageStyles/Suppliers/addSupplierModal.module.css";
import { useNavigate } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { MdAdd } from "react-icons/md";

const AddSupplierModal = () => {
  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Initialize products with one empty product row so it's always visible
  const [products, setProducts] = useState([
    { name: "", category: "", price: "" }
  ]);

  const [suppliers, setSuppliers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : []);
  }, []);

  // Handle change for supplier fields
  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  // Handle change for individual product fields
  const handleProductChange = (index, e) => {
    const updatedProducts = [...products];
    updatedProducts[index][e.target.name] = e.target.value;
    setProducts(updatedProducts);
  };

  // Add a new empty product row
  const addProductField = () => {
    setProducts([...products, { name: "", category: "", price: "" }]);
  };

  // Remove a product row
  const removeProductField = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  // Validate & Add Supplier to localStorage
  const handleAddSupplier = (newSupplier) => {
    if (!Array.isArray(suppliers)) return;

    // Check for duplicate email
    const emailExists = suppliers.some(
      (sup) => sup.email.toLowerCase() === newSupplier.email.toLowerCase()
    );

    if (emailExists) {
      alert("This email is already in use. Please use a different email.");
      return;
    }

    // Build supplier object with products
    const updatedSuppliers = [
      ...suppliers,
      { ...newSupplier, products, id: Date.now() }
    ];

    // Save to state and localStorage
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    if (
      !supplier.name ||
      !supplier.email ||
      !supplier.phone ||
      !supplier.address
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    handleAddSupplier(supplier);

    // Reset form
    setSupplier({ name: "", email: "", phone: "", address: "" });
    setProducts([{ name: "", category: "", price: "" }]); // Clear products
  };

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/suppliers")}>
        Back
      </button>

      <h3>Add New Supplier</h3>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Supplier Fields */}
        <div className={styles.inputWrapper}>
          <label>Supplier Name</label>
          <input
            type="text"
            name="name"
            placeholder="Business name"
            value={supplier.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="johndoe@example.com"
            value={supplier.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="10 digit phone number"
            value={supplier.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={`${styles.inputWrapper} ${styles.fullWidth}`}>
          <label>Address</label>
          <textarea
            name="address"
            placeholder="Business Address"
            value={supplier.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Section */}
        <div className={styles.fullWidth}>
          <h4>Supplier Products</h4>
          {products.map((product, index) => (
            <div key={index} className={styles.productRow}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => handleProductChange(index, e)}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={product.category}
                onChange={(e) => handleProductChange(index, e)}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price per Item"
                value={product.price}
                onChange={(e) => handleProductChange(index, e)}
                required
              />
              <div className={styles.addRemoveBtnGroup} >
                {/* Add Product Row Button (for next row) */}
                <button
                  type="button"
                  className={styles.addProductBtn}
                  onClick={addProductField}
                >
                  <MdAdd />
                </button>
                {/* Remove Product Row Button */}
                {products.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeProductBtn}
                    onClick={() => removeProductField(index)}
                  >
                    <GiCancel />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save / Cancel Buttons */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveBtn}>
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/suppliers")}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierModal;
