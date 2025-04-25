// src/pages/Reports/AddReportPage.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Reports/addReportPage.module.css";

import { getAllInventoryItems } from "../../api/inventory";
import { getAllCustomers } from "../../api/customers";
import { getAllOrders } from "../../api/orders";
import { getAllInvoices } from "../../api/invoice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6200ea"];

const AddReportPage = () => {
  const nav = useNavigate();

  // form state
  const [reportName, setReportName] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportType, setReportType] = useState("Inventory");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [previewData, setPreviewData] = useState(null);

  // raw data
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // load raw once
  useEffect(() => {
    Promise.all([
      getAllInventoryItems(),
      getAllCustomers(),
      getAllOrders(),
      getAllInvoices()
    ]).then(([inv, cust, ord, invc]) => {
      setInventory(inv);
      setCustomers(cust);
      setOrders(ord);
      setInvoices(invc);
    });
  }, []);

  // filter helper
  const filterByDate = (arr, key = "createdAt") => {
    if (!startDate || !endDate) return arr;
    const s = new Date(startDate), e = new Date(endDate);
    return arr.filter(x => {
      const d = new Date(x[key]);
      return d >= s && d <= e;
    });
  };

  // recompute previewData + details on form change
  const [dataDetails, setDataDetails] = useState({});
  useEffect(() => {
    if (!startDate || !endDate) { setPreviewData(null); setDataDetails({}); return; }
    let data = [];
    let details = {};

    switch (reportType) {
      case "Inventory": {
        const m = { in_stock: 0, out_of_stock: 0, overstocked: 0 };
        filterByDate(inventory, "createdAt").forEach(i => {
          m[i.status] = (m[i.status] || 0) + 1;
        });
        data = Object.entries(m).map(([name, value]) => ({ name, value }));
        details = {
          "Low Stock": inventory.filter(i => i.quantity < i.threshold).length,
          "Total Items": inventory.length
        };
        break;
      }
      case "Category": {
        const m = {};
        filterByDate(inventory, "createdAt").forEach(i => {
          m[i.category] = (m[i.category] || 0) + i.quantity;
        });
        data = Object.entries(m).map(([name, value]) => ({ name, value }));
        details = { "Categories": Object.keys(m).length };
        break;
      }
      case "Customers": {
        const arr = filterByDate(customers, "createdAt");
        const active = arr.filter(c => c.orders?.length > 0).length;
        data = Object.entries(
          arr.reduce((m, c) => {
            const d = c.createdAt.slice(0, 10);
            m[d] = (m[d] || 0) + 1; return m;
          }, {})
        ).map(([date, count]) => ({ date, count }));
        details = {
          "Total Customers": customers.length,
          "New in Range": arr.length,
          "Active in Range": active
        };
        break;
      }
      case "Orders": {
        const arr = filterByDate(orders, "createdAt");
        const byStatus = arr.reduce((m, o) => {
          m[o.status] = (m[o.status] || 0) + 1; return m;
        }, {});
        data = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
        details = {
          "Total Orders": arr.length,
          "Pending": byStatus.pending || 0,
          "Completed": byStatus.completed || 0
        };
        break;
      }
      case "Invoices": {
        const arr = filterByDate(invoices, "createdAt");
        const byStatus = arr.reduce((m, i) => {
          m[i.status] = (m[i.status] || 0) + 1; return m;
        }, {});
        data = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
        details = {
          "Total Revenue": arr.reduce((s, i) => s + i.amount, 0),
          "Paid": byStatus.paid || 0,
          "Pending": byStatus.pending || 0
        };
        break;
      }
      case "Sales": {
        const arr = filterByDate(invoices, "createdAt");
        const m = arr.reduce((m, i) => {
          const d = i.createdAt.slice(0, 10);
          m[d] = (m[d] || 0) + i.amount; return m;
        }, {});
        data = Object.entries(m).map(([date, total]) => ({ date, total }));
        details = {
          "Gross Sales": arr.reduce((s, i) => s + i.amount, 0),
          "Transactions": arr.length
        };
        break;
      }
      default: break;
    }

    setPreviewData(data);
    setDataDetails(details);
  }, [reportType, startDate, endDate, inventory, customers, orders, invoices]);

  const handleSave = () => {
    if (!reportName || !startDate || !endDate) return alert("Name & dates required");
    const saved = JSON.parse(localStorage.getItem("reports") || "[]");
    saved.push({
      _id: Date.now(),
      name: reportName,
      description: reportDesc,
      type: reportType,
      dateRange: { start: startDate, end: endDate },
      chartData: previewData,
      dataDetails
    });
    localStorage.setItem("reports", JSON.stringify(saved));
    nav("/reports");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Report</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Report Name</label>
          <input className={styles.input} value={reportName} onChange={e => setReportName(e.target.value)} />
        </div>
        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea className={styles.input} rows="2" value={reportDesc} onChange={e => setReportDesc(e.target.value)} />
        </div>
        <div className={styles.inputGroup}>
          <label>Type</label>
          <select className={styles.input} value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="Inventory">Inventory Report</option>
            <option value="Category">Category-wise Report</option>
            <option value="Customers">Customer Report</option>
            <option value="Orders">Order Report</option>
            <option value="Invoices">Payment/Invoice Report</option>
            <option value="Sales">Sales Report</option>
          </select>
        </div>
        <div className={styles.dateRow}>
          <div className={styles.inputGroup}>
            <label>Start Date</label>
            <input type="date" className={styles.input} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>End Date</label>
            <input type="date" className={styles.input} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <button className={styles.generateBtn} onClick={handleSave}>Save Report</button>
      </div>

      {previewData && (
        <div className={styles.preview}>
          <h2 className={styles.previewTitle}>{reportType} Preview</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
              {["Inventory", "Category", "Invoices"].includes(reportType) && (
                <PieChart>
                  <Pie
                    data={previewData}
                    dataKey="value"
                    nameKey={reportType === "Invoices" ? "name" : "name"}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    label
                  >
                    {previewData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
              {reportType === "Customers" && (
                <LineChart data={previewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              )}
              {reportType === "Orders" && (
                <BarChart data={previewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={COLORS[1]} barSize={20} />
                </BarChart>
              )}
              {reportType === "Sales" && (
                <LineChart data={previewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke={COLORS[2]} strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className={styles.detailSection}>
            <h3>Details</h3>
            <ul className={styles.detailList}>
              {Object.entries(dataDetails).map(([k, v]) => (
                <li key={k}><strong>{k}:</strong> {v}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReportPage;
