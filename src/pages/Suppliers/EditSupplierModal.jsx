// src/pages/Suppliers/EditSupplierModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Suppliers/editSupplierModal.module.css";
import { GiCancel } from "react-icons/gi";
import { MdAdd } from "react-icons/md";
import {
  validateEmail,
  validatePhone,
  validateAddress,
  validateName,
} from "../../utils/validators";

const EditSupplierModal = ({ onSave }) => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [updatedSupplier, setUpdatedSupplier] = useState(null);
  const [deletedProducts, setDeletedProducts] = useState([]); // Track IDs of products to delete
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch(`https://suims.vercel.app/api/supplier/${supplierId}`);
        const data = await res.json();
        const fetchedSupplier = data.supplier || data;
        if (!fetchedSupplier) {
          alert("Supplier not found!");
          navigate("/suppliers");
          return;
        }
        // Convert _id to id for consistency
        fetchedSupplier.id = fetchedSupplier._id;
        setUpdatedSupplier({
          ...fetchedSupplier,
          products:
            fetchedSupplier.products && fetchedSupplier.products.length > 0
              ? fetchedSupplier.products
              : [{ name: "", category: "", pricePerItem: "" }],
        });
      } catch (err) {
        console.error("Error fetching supplier:", err);
        alert("Error fetching supplier");
        navigate("/suppliers");
      }
    };
    fetchSupplier();
  }, [supplierId, navigate]);

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
    setUpdatedSupplier((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...updatedSupplier.products];
    newProducts[index][e.target.name] = e.target.value;
    setUpdatedSupplier((prev) => ({ ...prev, products: newProducts }));
  };

  const addProductField = () => {
    setUpdatedSupplier((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { name: "", category: "", pricePerItem: "" },
      ],
    }));
  };

  // Update deletion: instead of calling DELETE API here, we mark the product to delete.
  const handleDeleteProduct = (index) => {
    const product = updatedSupplier.products[index];
    // If the product already exists in the database, save its id for deletion.
    if (product._id) {
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (!confirmDelete) return;
      setDeletedProducts((prev) => [...prev, product._id]);
    }
    // Remove product from the local state.
    const newProducts = [...updatedSupplier.products];
    newProducts.splice(index, 1);
    setUpdatedSupplier((prev) => ({ ...prev, products: newProducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSaving(true);

    // Check that all supplier fields are provided.
    if (
      !updatedSupplier.name ||
      !updatedSupplier.email ||
      !updatedSupplier.phone ||
      !updatedSupplier.address
    ) {
      setSubmitError("Fields cannot be empty!");
      setIsSaving(false);
      return;
    }

    // Validate supplier fields.
    const emailError = validateEmail(updatedSupplier.email);
    const phoneError = validatePhone(updatedSupplier.phone);
    const nameError = validateName(updatedSupplier.name);
    const addressError = validateAddress(updatedSupplier.address);

    if (emailError || phoneError || nameError || addressError) {
      setErrors({
        email: emailError,
        phone: phoneError,
        name: nameError,
        address: addressError,
      });
      setSubmitError("Please fix the validation errors.");
      setIsSaving(false);
      return;
    }

    // Validate each product's fields.
    for (let product of updatedSupplier.products) {
      if (
        !product.name.trim() ||
        !product.category.trim() ||
        product.pricePerItem === "" ||
        Number(product.pricePerItem) <= 0
      ) {
        setSubmitError("Ensure all product fields are filled with valid values.");
        setIsSaving(false);
        return;
      }
    }


    const supplierPayload = {
      name: updatedSupplier.name,
      email: updatedSupplier.email.toLowerCase(),
      phone: updatedSupplier.phone,
      address: updatedSupplier.address,
      products: updatedSupplier.products.map((prod) => {
        if (prod._id) {
          return {
            productId: prod._id,
            name: prod.name,
            category: prod.category,
            pricePerItem: Number(prod.pricePerItem),
          };
        }
        return {
          name: prod.name,
          category: prod.category,
          pricePerItem: Number(prod.pricePerItem),
        };
      }),
    };

    if (deletedProducts.length > 0) {
      supplierPayload.deleteProducts = deletedProducts;
    }

    try {
      // Use PATCH for partial update.
      const response = await fetch(`https://suims.vercel.app/api/supplier/${supplierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierPayload),
      });

      if (!response.ok) throw new Error("Failed to update supplier");

      const savedSupplier = await response.json();
      savedSupplier.id = savedSupplier._id;
      if (onSave) onSave(savedSupplier);
      setIsSaving(false);
      navigate("/suppliers");
    } catch (error) {
      console.error("Error updating supplier:", error);
      setSubmitError("Error updating supplier. Please try again.");
      setIsSaving(false)
    }
  };

  if (!updatedSupplier) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading supplier data...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/suppliers")}>
        Back
      </button>
      <h3>Edit Supplier</h3>
      {submitError && <p className={styles.error}>{submitError}</p>}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <label>Supplier Name</label>
          <input
            type="text"
            name="name"
            value={updatedSupplier.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={updatedSupplier.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={updatedSupplier.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>
        <div className={`${styles.inputWrapper} ${styles.fullWidth}`}>
          <label>Address</label>
          <textarea
            name="address"
            value={updatedSupplier.address}
            onChange={handleChange}
            required
          />
          {errors.address && <span className={styles.error}>{errors.address}</span>}
        </div>
        <div className={styles.fullWidth}>
          <h4>Supplier Products</h4>
          {updatedSupplier.products.map((product, index) => (
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
                name="pricePerItem"
                placeholder="Price per Item"
                value={product.pricePerItem}
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
                {updatedSupplier.products.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeProductBtn}
                    onClick={() => handleDeleteProduct(index)}
                  >
                    <GiCancel />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {`${isSaving ? "Saving..." : "Save"}`}
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

export default EditSupplierModal;
