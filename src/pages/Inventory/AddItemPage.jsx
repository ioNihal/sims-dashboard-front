// src/pages/Inventory/AddItemPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/addItemPage.module.css";
import { validateObjectId, validateQuantity } from "../../utils/validators";

const AddItemPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productDetails, setProductDetails] = useState({ productId: "", category: "", pricePerItem: "" });
  const [quantity, setQuantity] = useState("");
  const [isSaving, setSaving] = useState(false);
  
  // error state
  const [errors, setErrors] = useState({
    supplier: "",
    product: "",
    quantity: "",
  });

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/supplier/");
        const data = await res.json();
        const arr = data.supplier || data;
        setSuppliers(arr.map(s => ({ ...s, id: s._id })));
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Update product list when supplier changes
  useEffect(() => {
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    setProducts(supplier?.products || []);
    setSelectedProduct("");
    setProductDetails({ productId: "", category: "", pricePerItem: "" });
    setErrors(e => ({ ...e, supplier: "", product: "" }));
  }, [selectedSupplierId, suppliers]);

  // Auto‑fill product details
  useEffect(() => {
    const prod = products.find(p => p.name === selectedProduct);
    if (prod) {
      setProductDetails({ productId: prod._id, category: prod.category, pricePerItem: prod.pricePerItem });
    } else {
      setProductDetails({ productId: "", category: "", pricePerItem: "" });
    }
    setErrors(e => ({ ...e, product: "" }));
  }, [selectedProduct, products]);

  const handleSubmit = async () => {
    // run validations
    const supplierErr = validateObjectId(selectedSupplierId);
    const productErr  = validateObjectId(productDetails.productId);
    const qtyErr      = validateQuantity(quantity);

    if (supplierErr || productErr || qtyErr) {
      setErrors({ supplier: supplierErr, product: productErr, quantity: qtyErr });
      return;
    }

    setSaving(true);

    const newItem = {
      supplierId: selectedSupplierId,
      productId: productDetails.productId,
      quantity: parseInt(quantity, 10),
    };

    try {
      const res = await fetch("https://suims.vercel.app/api/inventory/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error.message || "Failed to add item");
      alert("Item added successfully!");
      navigate("/inventory");
    } catch (err) {
      console.error(err);
      setErrors(e => ({ ...e, submit: err.message }));
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
      <h3>Add New Item</h3>
      {errors.submit && <p className={styles.error}>{errors.submit}</p>}

      <div className={styles.formGroup}>
        <label>Supplier</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.supplier && <p className={styles.error}>{errors.supplier}</p>}
      </div>

      {selectedSupplierId && (
        <div className={styles.formGroup}>
          <label>Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>
          {errors.product && <p className={styles.error}>{errors.product}</p>}
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
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors(e => ({ ...e, quantity: "" }));
              }}
            />
            {errors.quantity && <p className={styles.error}>{errors.quantity}</p>}
          </div>
        </>
      )}

      <div className={styles.buttonGroup}>
        <button onClick={handleSubmit} className={styles.saveBtn}>{`${isSaving ? "Saving..." : "Save"}`}</button>
        <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
      </div>
    </div>
  );
};

export default AddItemPage;
