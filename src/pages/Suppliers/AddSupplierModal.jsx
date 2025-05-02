import React, { useEffect, useState } from "react";
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
import { getSuppliers, createSupplier } from "../../api/suppliers";
import styles from "../../styles/PageStyles/Suppliers/addSupplierModal.module.css";
import toast from "react-hot-toast";

const AddSupplierModal = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({ name: "", email: "", phone: "", address: "" });
  const [products, setProducts] = useState([{ name: "", category: "", price: "" }]);
  const [existingSuppliers, setExistingSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setSaving] = useState(false);

  // load existing suppliers for duplicate‑email check
  useEffect(() => {
    (async () => {
      try {
        const list = await getSuppliers();
        setExistingSuppliers(list.map(s => ({ ...s, id: s._id })));
      } catch (err) {
        console.error("Error loading suppliers:", err.message);
      }
    })();
  }, []);

  const validateField = (field, value) => {
    switch (field) {
      case "name": return validateName(value);
      case "email": return validateEmail(value);
      case "phone": return validatePhone(value);
      case "address": return validateAddress(value);
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleProductChange = (i, e) => {
    const upd = [...products];
    upd[i][e.target.name] = e.target.value;
    setProducts(upd);
  };

  const addProductField = () => setProducts(prev => [...prev, { name: "", category: "", price: "" }]);
  const removeProductField = i => setProducts(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError("");
    setSaving(true);

    // validate supplier
    const fieldErrs = {};
    let hasErr = false;
    for (let [f, v] of Object.entries(supplier)) {
      const err = validateField(f, v);
      if (err) { fieldErrs[f] = err; hasErr = true; }
    }
    setErrors(fieldErrs);
    if (hasErr) { setSaving(false); return; }

    // validate products
    for (let p of products) {
      if (!p.name || !p.category || !p.price || Number(p.price) <= 0) {
        setSubmitError("Fill out all product fields with valid positive prices.");
        setSaving(false);
        return;
      }
    }

    // duplicate email?
    if (existingSuppliers.some(s => s.email.toLowerCase() === supplier.email.toLowerCase())) {
      setErrors(prev => ({
        ...prev,
        email: "This email is already in use. Choose another."
      }));
      toast.error("This email is already in use. Choose another.");
      setSaving(false);
      return;
    }

    // prepare payload
    const payload = {
      ...supplier,
      name: capitalize(supplier.name),
      products: products.map(p => ({
        name: capitalize(p.name),
        category: capitalize(p.category),
        pricePerItem: Number(p.price),
      })),
    };

    try {
      await createSupplier(payload);
      toast.success("Supplier added successfully!");
      navigate("/suppliers");
    } catch (err) {
      toast.error("Error adding supplier:", err.message);
      setSubmitError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate("/suppliers")}>
        Back
      </button>
      <h4>Add New Supplier</h4>

      {submitError && <p className={styles.error}>{submitError}</p>}

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {["name", "email", "phone", "address"].map(field => (
          <div
            key={field}
            className={`${styles.inputWrapper}${field === "address" ? ` ${styles.fullWidth}` : ""}`}
          >
            <label>{`${field === "phone" ? "Phone (+91)" : field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
            {field === "address" ? (
              <textarea
                name="address"
                placeholder={`Buisness Address...`}
                value={supplier.address}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                placeholder={field === "email" ? "buisness@email.com" : field === "phone" ? "10 digit Indian number" : "Buisness Name"}
                value={supplier[field]}
                onChange={handleChange}
                required
              />
            )}
            {errors[field] && <p className={styles.error}>{errors[field]}</p>}
          </div>
        ))}

        
        <div className={styles.fullWidth}>
          <h4>Supplier Products</h4>
          {products.map((prod, i) => (
            <div key={i} className={styles.productRow}>
              {["name", "category", "price"].map(attr => (
                <input
                  key={attr}
                  name={attr}
                  type={attr === "price" ? "number" : "text"}
                  placeholder={attr.charAt(0).toUpperCase() + attr.slice(1)}
                  value={prod[attr]}
                  onChange={e => handleProductChange(i, e)}
                  required
                />
              ))}
              <div className={styles.addRemoveBtnGroup}>
                <button type="button" onClick={addProductField} className={styles.addProductBtn}>
                  <MdAdd />
                </button>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProductField(i)}
                    className={styles.removeProductBtn}
                  >
                    <GiCancel />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

       
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={isSaving || Object.values(errors).some(Boolean)}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/suppliers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierModal;
