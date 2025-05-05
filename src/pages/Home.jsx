// src/pages/Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import styles from "./../styles/PageStyles/page.module.css";
import WidgetCard from "../components/widgets/WidgetCard";
import { getAllInventoryItems } from "../api/inventory";
import { getSuppliers } from "../api/suppliers";
import { getAllCustomers } from "../api/customers";
import { getAllOrders } from "../api/orders";
import { getAllInvoices } from "../api/invoice";
import RefreshButton from "../components/RefreshButton";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);

    // Fetch all endpoints independently so one failure won't block others
    const results = await Promise.allSettled([
      getAllInventoryItems(),
      getSuppliers(),
      getAllCustomers(),
      getAllOrders(),
      getAllInvoices()
    ]);

    // Map results to state, showing toast on individual failures
    const [invRes, supRes, custRes, ordRes, invcRes] = results;

    if (invRes.status === "fulfilled") setInventory(invRes.value || []);
    else toast.error("Failed to load inventory");

    if (supRes.status === "fulfilled") setSuppliers(supRes.value || []);
    else toast.error("Failed to load suppliers");

    if (custRes.status === "fulfilled") setCustomers(custRes.value || []);
    else toast.error("Failed to load customers");

    if (ordRes.status === "fulfilled") setOrders(ordRes.value || []);
    else setOrders([]) || toast.error("Failed to load orders");

    if (invcRes.status === "fulfilled") setInvoices(invcRes.value || []);
    else setInvoices([]) || toast.error("Failed to load invoices");

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const safeOrders = orders;
  const safeInventory = inventory;
  const safeInvoices = invoices;

  const inventoryStatusData = useMemo(() => {
    const counts = safeInventory.reduce((acc, item) => {
      const key = item.status || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [safeInventory]);

  const salesData = useMemo(() => {
    const daily = safeOrders.reduce((acc, order) => {
      const date = order.createdAt?.slice(0, 10) || "Unknown";
      acc[date] = (acc[date] || 0) + (order.totalAmount || 0);
      return acc;
    }, {});
    return Object.entries(daily)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [safeOrders]);

  const orderStatusData = useMemo(() => {
    const counts = safeOrders.reduce((acc, order) => {
      const key = order.status || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [safeOrders]);

  const topProductsData = useMemo(() => {
    const sales = {};
    safeOrders.forEach(order => {
      (order.orderProducts || []).forEach(p => {
        const name = p.inventoryId?.productName || p.name || "Unknown";
        sales[name] = (sales[name] || 0) + (p.quantity || 0);
      });
    });
    return Object.entries(sales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));
  }, [safeOrders]);

  const totalRevenue = safeInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const pendingOrders = safeOrders.filter(o => o.status === "pending").length;
  const lowStockItems = safeInventory.filter(i => i.quantity < i.threshold).length;
  const unpaidInvoices = safeInvoices.filter(inv => inv.status === "pending").length;

  const widgets = [
    { title: "Inventory Items", value: safeInventory.length, link: "/inventory" },
    { title: "Suppliers", value: suppliers.length, link: "/suppliers" },
    { title: "Customers", value: customers.length, link: "/customers" },
    { title: "Orders", value: safeOrders.length, link: "/orders" },
    { title: "Invoices", value: safeInvoices.length, link: "/invoices" },
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, description: "Total sales value", link: "/invoices" },
    { title: "Pending Orders", value: pendingOrders, description: "Require attention", link: "/orders" },
    { title: "Low Stock Items", value: lowStockItems, description: "Below threshold", link: "/inventory" },
    { title: "Unpaid Invoices", value: unpaidInvoices, description: "Pending payments", link: "/invoices" }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0"];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard Overview</h1>
      <div className={styles.actions}>
        <button className={styles.generateBtn} onClick={() => navigate("/reports")}>Go to Reports</button>
        <RefreshButton onClick={load} loading={loading} />
      </div>
      <div className={styles.insightContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <>
            <div className={styles.widgetsGrid}>
              {widgets.map((w, idx) => (
                <WidgetCard key={idx} title={w.title} value={w.value} description={w.description} link={w.link} />
              ))}
            </div>
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3>Sales Trend</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip wrapperStyle={{ fontSize: "1rem" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                    <Line type="monotone" dataKey="total" stroke={COLORS[0]} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.chartCard}>
                <h3>Inventory Status</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <PieChart>
                    <Pie data={inventoryStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" label={{ fontSize: "0.55rem" }}>
                      {inventoryStatusData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <Tooltip wrapperStyle={{ fontSize: "1rem" }} />
                    <Legend wrapperStyle={{ fontSize: '0.55rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.chartCard}>
                <h3>Top Selling Products</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip wrapperStyle={{ fontSize: "1rem" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                    <Bar dataKey="quantity" fill={COLORS[1]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.chartCard}>
                <h3>Order Status Distribution</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip wrapperStyle={{ fontSize: "1rem" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                    <Bar dataKey="value" fill={COLORS[2]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
