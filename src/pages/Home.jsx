import React, { useEffect, useState } from "react";
import styles from "../styles/PageStyles/page.module.css";
import WidgetCard from "../components/widgets/WidgetCard";

const Home = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [suppliersRes, customersRes, inventoryRes, ordersRes] = await Promise.all([
          fetch('https://suims.vercel.app/api/supplier'),
          fetch('https://suims.vercel.app/api/customer'),
          fetch('https://suims.vercel.app/api/inventory'),
          fetch('https://suims.vercel.app/api/orders')
        ]);

        const [
          suppliersData,
          customersData,
          inventoryData,
          ordersData
        ] = await Promise.all([
          suppliersRes.json(),
          customersRes.json(),
          inventoryRes.json(),
          ordersRes.json()
        ]);


        setSuppliers(suppliersData.supplier);
        setCustomers(customersData.data);
        setInventory(inventoryData.inventory);
        setOrders(ordersData.orders.filter(order => order.status === "pending"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardMetrics = [
    { title: "Inventory", value: `${inventory?.length || 0} Items`, description: "Stock levels overview", link: "/inventory" },
    { title: "Suppliers", value: `${suppliers?.length || 0} Active`, description: "Supplier details", link: "/suppliers" },
    { title: "Customers", value: `${customers?.length || 0} Active`, description: "Customer base", link: "/customers" },
    { title: "Orders", value: `${orders?.length || 0} New`, description: "Pending orders", link: "/orders" },
    { title: "Reports", value: "5 New", description: "System reports", link: "/reports" },
  ];


  if (loading) return (
    <div className={styles.page}>
      <p className={styles.loading}>Loading dashboard...</p>
    </div>
  );
  if (error) return (
    <div className={styles.page}>
      <p className={styles.error}>Error: {error}</p>
    </div>
  );

  return (
    <div className={styles.page}>
      <section className={styles.dashboard}>
        <h1>Dashboard Overview</h1>
        <div className={styles.widgetsGrid}>
          {dashboardMetrics.map((metric, index) => (
            <WidgetCard
              key={index}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              link={metric.link}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;