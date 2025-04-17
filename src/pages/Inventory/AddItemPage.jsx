// src/pages/Inventory/AddItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/addItemPage.module.css";
import { validateQuantity } from "../../utils/validators";

const AddItemPage = () => {
  const navigate = useNavigate();

  
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts]   = useState([]);

  
  const [supplierId, setSupplierId]     = useState("");
  const [productId, setProductId]       = useState("");
  const [quantity, setQuantity]         = useState("");

  
  const selectedProduct = products.find(p => p._id === productId) || {};

  
  const [errors, setErrors] = useState({
    supplier: "",
    product: "",
    quantity: "",
    submit: ""
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch all suppliers (and their products)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://suims.vercel.app/api/supplier/");
        if (!res.ok) throw new Error("Could not load suppliers");
        const json = await res.json();
        const list = json.supplier || [];
        setSuppliers(list.map(s => ({ ...s, id: s._id })));
      } catch (err) {
        console.error(err);
        setErrors(e => ({ ...e, submit: "Failed to load suppliers" }));
      }
    })();
  }, []);

  
  useEffect(() => {
    const sup = suppliers.find(s => s.id === supplierId);
    setProducts(sup?.products || []);
    setProductId("");
    setErrors(e => ({ ...e, supplier: "", product: "" }));
  }, [supplierId, suppliers]);

  
  const onQuantityChange = (e) => {
    const q = e.target.value;
    setQuantity(q);
    setErrors(e => ({ ...e, quantity: validateQuantity(q) }));
  };

  const handleSubmit = async () => {
    
    setErrors(e => ({ ...e, submit: "" }));

    
    const errs = {
      supplier: supplierId ? "" : "Please select a supplier.",
      product: productId ? "" : "Please select a product.",
      quantity: validateQuantity(quantity),
    };
    setErrors(e => ({ ...e, ...errs }));
    if (errs.supplier || errs.product || errs.quantity) return;

    const payload = { supplierId, productId, quantity: parseInt(quantity, 10) };

    setIsSaving(true);
    try {
      const res = await fetch("https://suims.vercel.app/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to add inventory");
      }
      navigate("/inventory");
    } catch (err) {
      console.error(err);
      setErrors(e => ({ ...e, submit: err.message }));
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Back
      </button>
      <h3>Add New Inventory Item</h3>

      {/* Supplier Selector */}
      <div className={styles.formGroup}>
        <label>Supplier</label>
        <select
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.supplier && <p className={styles.error}>{errors.supplier}</p>}
      </div>

      {/* Product Selector */}
      {supplierId && (
        <div className={styles.formGroup}>
          <label>Product</label>
          <select
            value={productId}
            onChange={e => {
              setProductId(e.target.value);
              setErrors(e => ({ ...e, product: "" }));
            }}
          >
            <option value="">-- Select Product --</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.product && <p className={styles.error}>{errors.product}</p>}
        </div>
      )}

      
      {productId && (
        <>
          <div className={styles.formGroup}>
            <label>Category</label>
            <input type="text" value={selectedProduct.category || ""} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Price per Unit</label>
            <input type="number" value={selectedProduct.pricePerItem || ""} readOnly />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={onQuantityChange}
            />
            {errors.quantity && <p className={styles.error}>{errors.quantity}</p>}
          </div>
        </>
      )}

      {/* Submission error */}
      {errors.submit && <p className={styles.error}>{errors.submit}</p>}

      {/* Buttons */}
      <div className={styles.buttonGroup}>
        <button
          onClick={handleSubmit}
          className={styles.saveBtn}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button onClick={() => navigate("/inventory")} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddItemPage;
