import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/PageStyles/Suppliers/editSupplierModal.module.css";

const EditSupplierPage = ({ onSave }) => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [updatedSupplier, setUpdatedSupplier] = useState(null);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    if (savedSuppliers) {
      const suppliers = JSON.parse(savedSuppliers);
      const supplierToEdit = suppliers.find(
        (supplier) => supplier.id.toString() === supplierId
      );
      if (supplierToEdit) {
        // Ensure products field exists; if not, initialize with one empty product row
        setUpdatedSupplier({
          ...supplierToEdit,
          products:
            supplierToEdit.products && supplierToEdit.products.length > 0
              ? supplierToEdit.products
              : [{ name: "", category: "", price: "" }],
        });
      } else {
        alert("Supplier not found!");
        navigate("/suppliers");
      }
    }
  }, [supplierId, navigate]);

  const handleChange = (e) => {
    setUpdatedSupplier({ ...updatedSupplier, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...updatedSupplier.products];
    newProducts[index][e.target.name] = e.target.value;
    setUpdatedSupplier({ ...updatedSupplier, products: newProducts });
  };

  const addProductField = () => {
    setUpdatedSupplier({
      ...updatedSupplier,
      products: [
        ...updatedSupplier.products,
        { name: "", category: "", price: "" },
      ],
    });
  };

  const removeProductField = (index) => {
    const newProducts = [...updatedSupplier.products];
    newProducts.splice(index, 1);
    setUpdatedSupplier({ ...updatedSupplier, products: newProducts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !updatedSupplier.name ||
      !updatedSupplier.email ||
      !updatedSupplier.phone ||
      !updatedSupplier.address
    ) {
      alert("Fields cannot be empty!");
      return;
    }
    const savedSuppliers = localStorage.getItem("suppliers");
    let suppliers = savedSuppliers ? JSON.parse(savedSuppliers) : [];
    suppliers = suppliers.map((supplier) =>
      supplier.id.toString() === supplierId ? updatedSupplier : supplier
    );
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    if (onSave) onSave(updatedSupplier);
    navigate("/suppliers");
  };

  if (!updatedSupplier) {
    return (
      <div className={styles.page}>
        <p>Loading supplier data...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/suppliers")}>
        Back
      </button>

      <h3>Edit Supplier</h3>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Supplier Fields */}
        <div className={styles.inputWrapper}>
          <label>Supplier Name</label>
          <input
            type="text"
            name="name"
            value={updatedSupplier.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={updatedSupplier.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={updatedSupplier.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={`${styles.inputWrapper} ${styles.fullWidth}`}>
          <label>Address</label>
          <textarea
            name="address"
            value={updatedSupplier.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Section */}
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
                  +
                </button>
                {updatedSupplier.products.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeProductBtn}
                    onClick={() => removeProductField(index)}
                  >
                    –
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

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

export default EditSupplierPage;
