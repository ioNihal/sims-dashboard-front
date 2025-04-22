import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Invoices/addInvoicePage.module.css";

const AddInvoicePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCust, resOrd] = await Promise.all([
          fetch("https://suims.vercel.app/api/customer"),
          fetch("https://suims.vercel.app/api/orders"),
        ]);
        const custData = await resCust.json();
        const ordData = await resOrd.json();
        setCustomers((custData.data || custData).map(c => ({ ...c, id: c._id })));
        setOrders(Array.isArray(ordData) ? ordData : ordData.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const filteredOrders = orders.filter(
    o => o.customer?.toLowerCase() === selectedCustomer.toLowerCase()
  );

  const toggleOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSubmit = async () => {
    setActionError(null);
    const customer = customers.find(c => c.name === selectedCustomer);
    if (!customer || selectedOrders.length === 0) {
      return setActionError("Select a customer and at least one order.");
    }

    const chosenOrders = filteredOrders.filter(o => selectedOrders.includes(o.id));
    const total = chosenOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const payload = {
      customerId: customer.id,
      customer: customer.name,
      totalAmount: total,
      createdAt: new Date().toISOString(),
      orders: chosenOrders,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };

    try {
      const res = await fetch("https://suims.vercel.app/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Invoice creation failed.");
      alert("Invoice generated successfully!");
      navigate("/invoices");
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Generate Invoice</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.form}>
        <div className={styles.field}>
          <label>Select Customer:</label>
          <select
            value={selectedCustomer}
            onChange={(e) => {
              setSelectedCustomer(e.target.value);
              setSelectedOrders([]);
            }}
          >
            <option value="">-- Select --</option>
            {customers.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCustomer && (
          <div className={styles.field}>
            <label>Select Orders:</label>
            <div className={styles.ordersList}>
              {filteredOrders.map(o => (
                <div key={o.id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`order-${o.id}`}
                    checked={selectedOrders.includes(o.id)}
                    onChange={() => toggleOrder(o.id)}
                  />
                  <label htmlFor={`order-${o.id}`}>
                    {o.orderNumber || o._id} - ₹{o.totalAmount}
                  </label>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <p className={styles.info}>No orders found for selected customer.</p>
              )}
            </div>
          </div>
        )}

        {actionError && <p className={styles.errorSmall}>{actionError}</p>}

        <button
          className={styles.generateBtn}
          onClick={handleSubmit}
          disabled={!selectedCustomer || selectedOrders.length === 0}
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default AddInvoicePage;
