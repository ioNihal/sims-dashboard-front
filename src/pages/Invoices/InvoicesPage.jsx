import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import styles from "../../styles/PageStyles/Invoices/invoicesPage.module.css";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const resCustomers = await fetch("https://suims.vercel.app/api/customer");
        if (!resCustomers.ok) throw new Error("Failed to fetch customers");
        const customersData = await resCustomers.json();
        const formattedCustomers = (customersData.data || customersData).map((c) => ({
          ...c,
          id: c._id,
        }));
        formattedCustomers.sort((a, b) => a.name.localeCompare(b.name));
        setCustomers(formattedCustomers);

        // Fetch orders
        const resOrders = await fetch("https://suims.vercel.app/api/orders");
        if (!resOrders.ok) throw new Error("Failed to fetch orders");
        const ordersData = await resOrders.json();
        setOrders(ordersData);

        // Fetch invoices
        const resInvoices = await fetch("https://suims.vercel.app/api/invoices");
        if (!resInvoices.ok) throw new Error("Failed to fetch invoices");
        const invoicesData = await resInvoices.json();
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o.customer &&
      o.customer.toLowerCase() === selectedCustomer.toLowerCase()
  );

  const handleGenerateInvoice = async () => {
    if (!selectedCustomer) return alert("Please select a customer.");

    const foundCustomer =
      customers.find(
        (c) => c.name.toLowerCase() === selectedCustomer.toLowerCase()
      ) || {
        id: null,
        name: selectedCustomer,
        email: "",
        phone: "",
        address: "",
      };

    let chosenOrders = [];

    if (selectedOrder === "" || selectedOrder === "all") {
      chosenOrders = filteredOrders;
    } else {
      const order = filteredOrders.find((o) => String(o.id) === selectedOrder);
      if (!order) return alert("Order not found for this customer.");
      chosenOrders = [order];
    }

    if (chosenOrders.length === 0) return alert("No orders found.");

    const total = chosenOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const invoice = {
      customerId: foundCustomer.id,
      customer: foundCustomer.name,
      totalAmount: total,
      createdAt: new Date().toISOString(),
      orders: chosenOrders,
      email: foundCustomer.email,
      phone: foundCustomer.phone,
      address: foundCustomer.address,
    };

    try {
      const res = await fetch("https://suims.vercel.app/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (!res.ok) throw new Error("Failed to create invoice");

      const newInvoice = await res.json();
      setInvoices((prev) => [...prev, newInvoice]);
      alert("Invoice generated successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Error generating invoice.");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      String(inv._id).toLowerCase().includes(q) ||
      (inv.customer && inv.customer.toLowerCase().includes(q)) ||
      (inv.createdAt &&
        new Date(inv.createdAt).toLocaleDateString().toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Invoices</h1>

      <div className={styles.actions}>
        <div className={styles.selectionForm}>
          <div className={styles.formRow}>
            <label>Customer:</label>
            <select
              value={selectedCustomer}
              onChange={(e) => {
                setSelectedCustomer(e.target.value);
                setSelectedOrder("");
              }}
            >
              <option value="">-- Select Customer --</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.name}>
                  {cust.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <div className={styles.formRow}>
              <label>Order:</label>
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
              >
                <option value="all">All Orders</option>
                {filteredOrders.map((order) => (
                  <option key={order.id} value={String(order.id)}>
                    {order.orderNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className={styles.generateBtn} onClick={handleGenerateInvoice}>
            Generate Invoice
          </button>
        </div>

        <div className={styles.searchBarWrapper}>
          <SearchBar
            placeholder="Search invoices..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <p className={styles.noInvoices}>No invoices generated yet.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv._id}</td>
                  <td>{inv.customer || "N/A"}</td>
                  <td>${inv.totalAmount || "N/A"}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => navigate(`/invoice/view/${inv._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
