// src/pages/Inventory/AddItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/addItemPage.module.css";

const AddItemPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productDetails, setProductDetails] = useState({ productId: "", category: "", pricePerItem: "" });
  const [quantity, setQuantity] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch suppliers from API (adjust endpoint as needed)
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/supplier/");
        const data = await res.json();
        const supplierArray = data.supplier || data;
        setSuppliers(
          supplierArray.map((s) => ({
            ...s,
            id: s._id,
          }))
        );
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // When a supplier is selected, update the products dropdown.
  useEffect(() => {
    if (selectedSupplierId) {
      const supplier = suppliers.find((s) => s.id.toString() === selectedSupplierId);
      if (supplier && supplier.products) {
        setProducts(supplier.products);
      } else {
        setProducts([]);
      }
      // Reset product selection and auto-filled details.
      setSelectedProduct("");
      setProductDetails({ productId: "", category: "", pricePerItem: "" });
    }
  }, [selectedSupplierId, suppliers]);

  // When a product is selected, auto-fill its category and price.
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.name === selectedProduct);
      if (product) {
        setProductDetails({ productId: product._id, category: product.category, pricePerItem: product.pricePerItem });
      }
    } else {
      setProductDetails({ productId: "", category: "", pricePerItem: "" });
    }
  }, [selectedProduct, products]);

  const handleSubmit = async () => {
    if (!selectedSupplierId || !selectedProduct || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }

    const supplier = suppliers.find((s) => s.id.toString() === selectedSupplierId);
    const newQty = parseInt(quantity, 10);
    const supplierName = supplier ? supplier.name : "";

    // Create a new item object.
    const newItem = {
      supplierId: supplier ? supplier.id : null,
      productId: productDetails.productId,
      quantity: newQty,
    };

    try {
      const response = await fetch("https://suims.vercel.app/api/inventory/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      alert("Item added successfully!");
      navigate("/inventory");
    } catch (err) {
      console.error("Error adding item:", err);

    }
  };

  const handleCancel = () => {
    if (selectedSupplierId === "") navigate("/inventory");
    setSelectedSupplierId("");
    setProducts([]);
    setSelectedProduct("");
    setProductDetails({ category: "", pricePerItem: "" });
    setQuantity("");
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Back
      </button>
      <h3>Add New Item</h3>
      <div className={styles.formGroup}>
        <label>Supplier</label>
        <select value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)}>
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      {selectedSupplierId && (
        <div className={styles.formGroup}>
          <label>Product</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Select Product</option>
            {products.map((product, index) => (
              <option key={index} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedProduct && (
        <>
          <div className={styles.formGroup}>
            <label>Product ID</label>
            <input type="text" value={productDetails.productId} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Category</label>
            <input type="text" value={productDetails.category} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Price per Unit</label>
            <input type="number" value={productDetails.pricePerItem} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
        </>
      )}
      <div className={styles.buttonGroup}>
        <button onClick={handleSubmit} className={styles.saveBtn}>
          Save
        </button>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddItemPage;
