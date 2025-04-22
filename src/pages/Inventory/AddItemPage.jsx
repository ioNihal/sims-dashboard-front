// src/pages/Inventory/AddItemPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Inventory/addItemPage.module.css";
import { validateQuantity, validateThreshold } from "../../utils/validators";
import { getSuppliers } from "../../api/suppliers";
import { addInventoryItem } from "../../api/inventory";

const AddItemPage = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");

  const selectedProduct = products.find((p) => p._id === productId) || {};

  const [errors, setErrors] = useState({
    supplier: "",
    product: "",
    quantity: "",
    threshold: "",
    submit: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  // load suppliers
  useEffect(() => {
    (async () => {
      try {
        const list = await getSuppliers();
        setSuppliers(list.map(s => ({ ...s, id: s._id })));
      } catch (err) {
        console.error(err);
        setErrors(e => ({ ...e, submit: "Failed to load suppliers" }));
      }
    })();
  }, []);

  // when supplier changes, reset products & productId
  useEffect(() => {
    const sup = suppliers.find((s) => s.id === supplierId);
    setProducts(sup?.products || []);
    setProductId("");
    setErrors((e) => ({ ...e, supplier: "", product: "" }));
  }, [supplierId, suppliers]);

  const onQuantityChange = (e) => {
    const q = e.target.value;
    setQuantity(q);
    setErrors((e) => ({ ...e, quantity: validateQuantity(q) }));
  };
  const onThresholdChange = (e) => {
    const t = e.target.value;
    setThreshold(t);
    setErrors((e) => ({ ...e, threshold: validateThreshold(t) }));
  };

  const handleSubmit = async () => {
    // clear submit error
    setErrors((e) => ({ ...e, submit: "" }));

    // validate all
    const fieldErrors = {
      supplier: supplierId ? "" : "Please select a supplier.",
      product: productId ? "" : "Please select a product.",
      quantity: validateQuantity(quantity),
      threshold: validateThreshold(threshold),
    };
    setErrors((e) => ({ ...e, ...fieldErrors }));
    if (Object.values(fieldErrors).some((msg) => msg)) return;

    const payload = {
      supplierId,
      productId,
      quantity: parseInt(quantity, 10),
      threshold: parseInt(threshold, 10),
    };

    setIsSaving(true);
    try {
      await addInventoryItem(payload);
      navigate("/inventory");
    } catch (err) {
      console.error(err);
      setErrors((e) => ({ ...e, submit: err.message }));
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Back
      </button>
      <h3>Add Item</h3>

      <div className={styles.formGroup}>

        <div className={styles.inputWrapper}>
          <label>Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.supplier && <p className={styles.error}>{errors.supplier}</p>}
        </div>


        <div className={styles.inputWrapper}>
          <label>Product</label>
          <select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setErrors((e) => ({ ...e, product: "" }));
            }}
            disabled={!supplierId}
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          {errors.product && <p className={styles.error}>{errors.product}</p>}
        </div>


        <div className={styles.inputWrapper}>
          <label>Category</label>
          <input
            type="text"
            value={selectedProduct.category || ""}
            disabled
            readOnly
          />
        </div>


        <div className={styles.inputWrapper}>
          <label>Unit Price</label>
          <input
            type="number"
            value={selectedProduct.pricePerItem || ""}
            disabled
            readOnly
          />
        </div>


        <div className={styles.inputWrapper}>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={onQuantityChange}
            disabled={!productId}
          />
          {errors.quantity && <p className={styles.error}>{errors.quantity}</p>}
        </div>


        <div className={styles.inputWrapper}>
          <label>Low Stock Threshold</label>
          <input
            type="number"
            value={threshold}
            onChange={onThresholdChange}
            disabled={!productId}
          />
          {errors.threshold && <p className={styles.error}>{errors.threshold}</p>}
        </div>
        {errors.submit && <p className={styles.error}>{errors.submit}</p>}
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmit}
            className={styles.saveBtn}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => navigate("/inventory")}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
