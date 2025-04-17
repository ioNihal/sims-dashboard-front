// src/pages/Home.jsx
import React from "react";
import styles from "../styles/PageStyles/page.module.css";
import WidgetCard from "../components/widgets/WidgetCard";

const Home = () => {
  

  const dashboardMetrics = [
    { title: "Inventory", value: "1500 Items", description: "Stock levels overview", link: "/inventory" },
    { title: "Suppliers", value: "12 Active", description: "Supplier details", link: "/suppliers" },
    { title: "Customers", value: "350 Active", description: "Customer base", link: "/customers" },
    { title: "Orders", value: "24 Pending", description: "Pending orders", link: "/orders" },
    { title: "Reports", value: "5 New", description: "System reports", link: "/reports" },
  ];

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
