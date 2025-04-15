// src/pages/Suppliers/AddSupplierModal.jsx
import React, { useEffect, useState } from "react";
import styles from "../../styles/PageStyles/Suppliers/addSupplierModal.module.css";
import { useNavigate } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { MdAdd } from "react-icons/md";
import {
  validateEmail,
  validatePhone,
  validateAddress,
  validateName,
  capitalize,
} from "../../utils/validators";

const AddSupplierModal = () => {
  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [products, setProducts] = useState([{ name: "", category: "", price: "" }]);
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setSaving] = useState(false);
  const navigate = useNavigate();

  
  

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/supplier");
        const data = await res.json();
        const supplierArray = data.supplier || data;
        const formatted = supplierArray.map((s) => ({ ...s, id: s._id }));
        setSuppliers(formatted);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "address":
        return validateAddress(value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleProductChange = (index, e) => {
    const updatedProducts = [...products];
    updatedProducts[index][e.target.name] = e.target.value;
    setProducts(updatedProducts);
  };

  const addProductField = () => {
    setProducts([...products, { name: "", category: "", price: "" }]);
  };

  const removeProductField = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSaving(true);

    // Validate supplier fields
    const fieldErrors = {};
    let hasError = false;
    Object.entries(supplier).forEach(([field, value]) => {
      const err = validateField(field, value);
      if (err) {
        fieldErrors[field] = err;
        hasError = true;
      }
    });
    setErrors(fieldErrors);
    if (hasError) {
      setSaving(false);
      return;
    }

    // Validate product fields (if any products are entered)
    for (let product of products) {
      if (
        !product.name.trim() ||
        !product.category.trim() ||
        product.price === "" ||
        Number(product.price) <= 0
      ) {
        setSubmitError(
          "Please ensure all product fields are filled out correctly with positive prices."
        );
        setSaving(false);
        return;
      }
    }

    // Check duplicate email among suppliers
    const emailExists = suppliers.some(
      (sup) => sup.email.toLowerCase() === supplier.email.toLowerCase()
    );
    if (emailExists) {
      setErrors((prev) => ({
        ...prev,
        email: "This email is already in use. Please use a different email.",
      }));
      setSaving(false);
      return;
    }

    // Combine supplier details and the products array.
    // Capitalize the first letter of supplier name, product name, and product category.
    const newSupplierData = {
      ...supplier,
      name: capitalize(supplier.name),
      products: products.map((prod) => ({
        name: capitalize(prod.name),
        category: capitalize(prod.category),
        pricePerItem: Number(prod.price),
      })),
    };

    // Call the supplier API endpoint with the complete data
    try {
      const supplierResponse = await fetch("https://suims.vercel.app/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplierData),
      });
      if (!supplierResponse.ok) {
        const errorData = await supplierResponse.json();
        console.log(errorData);
        throw new Error(
          (errorData.error.message) || "Failed to add supplier"
        );
      }
      await supplierResponse.json();
      setSaving(false);
      navigate("/suppliers");
    } catch (error) {
      console.error("Error adding supplier:", error);
      setSaving(false);
      setSubmitError(`${error}`);
    }
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
          {errors.name && <p className={styles.error}>{errors.name}</p>}
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
          {errors.email && <p className={styles.error}>{errors.email}</p>}
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
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
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
          {errors.address && <p className={styles.error}>{errors.address}</p>}
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
              <div className={styles.addRemoveBtnGroup}>
                <button
                  type="button"
                  className={styles.addProductBtn}
                  onClick={addProductField}
                >
                  <MdAdd />
                </button>
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

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={Object.values(errors).some((e) => e) || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
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
      {submitError && (
        <p className={styles.error} style={{ textAlign: "center" }}>
          {submitError}
        </p>
      )}
    </div>
  );
};

export default AddSupplierModal;
