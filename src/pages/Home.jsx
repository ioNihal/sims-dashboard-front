import React, { useEffect, useState } from "react";
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
import  RefreshButton  from "../components/RefreshButton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const [
        inv,
        sup,
        cust,
        ord,
        invc
      ] = await Promise.all([
        getAllInventoryItems(),
        getSuppliers(),
        getAllCustomers(),
        getAllOrders(),
        getAllInvoices()
      ]);
      setInventory(inv);
      setSuppliers(sup);
      setCustomers(cust);
      setOrders(ord);
      setInvoices(invc);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Process data for visualizations
  const getInventoryStatusData = () => {
    const statusCounts = inventory.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const getSalesData = () => {
    const dailySales = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});
    return Object.entries(dailySales).map(([date, total]) => ({ date, total }));
  };

  const getOrderStatusData = () => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const getTopProducts = () => {
    const productSales = {};
    orders.forEach(order => {
      order.orderProducts.forEach(product => {
        productSales[product.name] =
          (productSales[product.name] || 0) + product.quantity;
      });
    });
    return Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));
  };

  // Calculate additional metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold).length;
  const unpaidInvoices = invoices.filter(inv => inv.status === 'pending').length;

  const widgets = [
    // Existing widgets
    { title: "Inventory Items", value: inventory.length, link: "/inventory" },
    { title: "Suppliers", value: suppliers.length, link: "/suppliers" },
    { title: "Customers", value: customers.length, link: "/customers" },
    { title: "Orders", value: orders.length, link: "/orders" },
    { title: "Invoices", value: invoices.length, link: "/invoices" },
    // New KPIs
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "Total sales value",
      link: "/invoices"
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      description: "Require attention",
      link: "/orders"
    },
    {
      title: "Low Stock Items",
      value: lowStockItems,
      description: "Below threshold",
      link: "/inventory"
    },
    {
      title: "Unpaid Invoices",
      value: unpaidInvoices,
      description: "Pending payments",
      link: "/invoices"
    }
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard Overview</h1>
      <div className={styles.actions}>
        <button className={styles.generateBtn} onClick={() => navigate("/reports")}>Go to Reports</button>
        <RefreshButton onClick={load} loading={loading} />
      </div>
      <div className={styles.insightContainer}>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.widgetsGrid}>
              {widgets.map((w, idx) => (
                <WidgetCard
                  key={idx}
                  title={w.title}
                  value={w.value}
                  description={w.description}
                  link={w.link}
                />
              ))}
            </div>

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3>Sales Trend</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <LineChart data={getSalesData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip wrapperStyle={{ fontSize: "1rem", color: "purple" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      strokeWidth={1}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Inventory Status */}
              <div className={styles.chartCard}>
                <h3>Inventory Status</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <PieChart >
                    <Pie
                      data={getInventoryStatusData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getInventoryStatusData().map((entry, index) => (
                        <Cell key={index} fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip wrapperStyle={{ fontSize: "1rem", color: "purple" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products */}
              <div className={styles.chartCard}>
                <h3>Top Selling Products</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <BarChart data={getTopProducts()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip wrapperStyle={{ fontSize: "1rem", color: "purple" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                    <Bar dataKey="quantity" fill="#82ca9d" barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status */}
              <div className={styles.chartCard}>
                <h3>Order Status Distribution</h3>
                <ResponsiveContainer width="95%" height="85%" wrapperStyle={{ margin: "auto" }}>
                  <BarChart data={getOrderStatusData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: "0.7rem" }} />
                    <YAxis tick={{ fontSize: "0.7rem" }} />
                    <Tooltip wrapperStyle={{ fontSize: "1rem", color: "purple" }} />
                    <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                    <Bar dataKey="value" fill="#ff7300" />
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
