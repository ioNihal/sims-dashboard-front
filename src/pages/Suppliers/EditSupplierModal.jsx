import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { MdAdd } from "react-icons/md";
import {
  validateEmail,
  validatePhone,
  validateAddress,
  validateName,
  capitalize,
} from "../../utils/validators";

import { getSupplier, updateSupplier } from "../../api/suppliers";
import styles from "../../styles/PageStyles/Suppliers/editSupplierModal.module.css";

const EditSupplierModal = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setSaving] = useState(false);

  // load existing supplier
  useEffect(() => {
    (async () => {
      try {
        const data = await getSupplier(supplierId);
        data.id = data._id;
        setSupplier({
          ...data,
          products:
            data.products && data.products.length
              ? data.products
              : [{ name: "", category: "", pricePerItem: "" }],
        });
      } catch (err) {
        alert(err.message);
        navigate("/suppliers");
      }
    })();
  }, [supplierId, navigate]);

  // simple field validation
  const validateField = (field, value) => {
    switch (field) {
      case "name":    return validateName(value);
      case "email":   return validateEmail(value);
      case "phone":   return validatePhone(value);
      case "address": return validateAddress(value);
      default:        return "";
    }
  };

  // handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setSupplier(s => ({ ...s, [name]: value }));
    setErrors(e => ({ ...e, [name]: validateField(name, value) }));
  };

  const handleProductChange = (i, e) => {
    setSupplier(s => {
      const prods = [...s.products];
      prods[i][e.target.name] = e.target.value;
      return { ...s, products: prods };
    });
  };

  const addProductField = () =>
    setSupplier(s => ({
      ...s,
      products: [...s.products, { name: "", category: "", pricePerItem: "" }],
    }));

  const handleDeleteProduct = i => {
    const prod = supplier.products[i];
    if (prod._id && !window.confirm("Delete this product?")) return;
    if (prod._id) setDeletedProducts(d => [...d, prod._id]);

    setSupplier(s => {
      const prods = [...s.products];
      prods.splice(i, 1);
      return { ...s, products: prods };
    });
  };

  // form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError("");
    setSaving(true);

    // basic required‐field check
    if (!supplier.name || !supplier.email || !supplier.phone || !supplier.address) {
      setSubmitError("All fields are required.");
      return setSaving(false);
    }

    // run validators
    const fieldErrs = {
      name:    validateName(supplier.name),
      email:   validateEmail(supplier.email),
      phone:   validatePhone(supplier.phone),
      address: validateAddress(supplier.address),
    };
    if (Object.values(fieldErrs).some(Boolean)) {
      setErrors(fieldErrs);
      setSubmitError("Fix validation errors.");
      return setSaving(false);
    }

    // product rows validation
    for (let p of supplier.products) {
      if (!p.name || !p.category || Number(p.pricePerItem) <= 0) {
        setSubmitError("Ensure all products have valid name, category, and price.");
        return setSaving(false);
      }
    }

    // build payload
    const payload = {
      name:    capitalize(supplier.name),
      email:   supplier.email.toLowerCase(),
      phone:   supplier.phone,
      address: supplier.address,
      products: supplier.products.map(p =>
        p._id
          ? { productId: p._id, name: p.name, category: p.category, pricePerItem: Number(p.pricePerItem) }
          : { name: p.name, category: p.category, pricePerItem: Number(p.pricePerItem) }
      ),
    };
    if (deletedProducts.length) {
      payload.deleteProducts = deletedProducts;
    }

    // call API
    try {
      await updateSupplier(supplierId, payload);
      navigate("/suppliers");
    } catch (err) {
      setSubmitError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!supplier) {
    return <p className={styles.loading}>Loading supplier data…</p>;
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/suppliers")}>
        Back
      </button>
      <h4>Edit Supplier</h4>
      {submitError && <p className={styles.error}>{submitError}</p>}

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {/* Supplier fields */}
        {["name","email","phone","address"].map(f => (
          <div
            key={f}
            className={`${styles.inputWrapper}${f==="address"?` ${styles.fullWidth}`:""}`}
          >
            <label>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
            {f==="address" ? (
              <textarea name="address" value={supplier.address} onChange={handleChange} />
            ) : (
              <input
                type={f==="email"?"email": f==="phone"?"tel":"text"}
                name={f}
                value={supplier[f]}
                onChange={handleChange}
              />
            )}
            {errors[f] && <span className={styles.error}>{errors[f]}</span>}
          </div>
        ))}

        {/* Products */}
        <div className={styles.fullWidth}>
          <h4>Supplier Products</h4>
          {supplier.products.map((p, i) => (
            <div key={i} className={styles.productRow}>
              {["name","category","pricePerItem"].map(attr => (
                <input
                  key={attr}
                  name={attr}
                  type={attr==="pricePerItem"?"number":"text"}
                  placeholder={attr.replace(/([A-Z])/g, " $1")}
                  value={p[attr]}
                  onChange={e => handleProductChange(i, e)}
                />
              ))}
              <div className={styles.addRemoveBtnGroup}>
                <button type="button" onClick={addProductField} className={styles.addProductBtn}>
                  <MdAdd />
                </button>
                {supplier.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(i)}
                    className={styles.removeProductBtn}
                  >
                    <GiCancel />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isSaving} className={styles.saveBtn}>
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
    </div>
  );
};

export default EditSupplierModal;
