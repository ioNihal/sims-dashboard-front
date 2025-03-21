// pages/Invoices/InvoicesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import styles from "../../styles/PageStyles/Invoices/invoicesPage.module.css";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    const savedOrders = localStorage.getItem("orders");
    const savedInvoices = localStorage.getItem("invoices");

    if (savedCustomers) {
      const custArr = JSON.parse(savedCustomers);
      custArr.sort((a, b) => a.name.localeCompare(b.name));
      setCustomerList(custArr);
    }
    if (savedOrders) {
      setOrdersList(JSON.parse(savedOrders));
    }
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  const filteredOrdersForCustomer = ordersList.filter(
    (o) =>
      o.customer &&
      o.customer.toLowerCase() === selectedCustomer.toLowerCase()
  );

  const handleGenerateInvoice = () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }
    // Retrieve customer info including the id
    const foundCustomer =
      customerList.find(
        (c) => c.name.toLowerCase() === selectedCustomer.toLowerCase()
      ) || { id: null, name: selectedCustomer, email: "", phone: "", address: "" };

    let chosenOrders = [];
    if (selectedOrder === "" || selectedOrder === "all") {
      chosenOrders = filteredOrdersForCustomer;
    } else {
      const singleOrder = filteredOrdersForCustomer.find(
        (o) => String(o.id) === selectedOrder
      );
      if (!singleOrder) {
        alert("Order not found for the selected customer.");
        return;
      }
      chosenOrders = [singleOrder];
    }

    if (chosenOrders.length === 0) {
      alert("No orders found for this selection.");
      return;
    }

    setInvoiceOrders(chosenOrders);
    setCustomerInfo(foundCustomer);

    // Calculate combined total
    const total = chosenOrders.reduce(
      (acc, order) => acc + Number(order.totalAmount),
      0
    );
    setCombinedTotal(total);

    // Build an invoice object including the customer ID
    const newInvoice = {
      _id: Date.now(), // pseudo-ID
      customerId: foundCustomer.id, // store customer id
      customer: foundCustomer.name,
      totalAmount: total,
      createdAt: new Date().toISOString(),
      orders: chosenOrders,
      email: foundCustomer.email,
      phone: foundCustomer.phone,
      address: foundCustomer.address,
    };

    const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const updatedInvoices = [...savedInvoices, newInvoice];
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);

    alert("Invoice generated successfully!");
  };

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter((inv) => {
    const query = searchQuery.toLowerCase();
    return (
      String(inv._id).toLowerCase().includes(query) ||
      (inv.customer && inv.customer.toLowerCase().includes(query)) ||
      (inv.createdAt &&
        new Date(inv.createdAt).toLocaleDateString().toLowerCase().includes(query))
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
              {customerList.map((cust) => (
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
                {filteredOrdersForCustomer.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.orderNumber}
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
