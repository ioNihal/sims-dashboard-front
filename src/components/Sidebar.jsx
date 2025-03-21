// Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaBoxOpen, 
  FaUsers, 
  FaUserTie, 
  FaClipboardList, 
  FaChartBar, 
  FaBars,
  FaUserCircle,
  FaFileInvoice
} from "react-icons/fa";
import { FaTruckFront } from "react-icons/fa6";
import styles from "../styles/SideBar/sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.toggleBtn} onClick={toggleSidebar}>
        <FaBars />
      </div>
      <h2 className={styles.logo}>{isOpen && 'Dashboard'}</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaHome className={styles.icon} />
              {isOpen && <span>Home</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaBoxOpen className={styles.icon} />
              {isOpen && <span>Inventory</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaUsers className={styles.icon} />
              {isOpen && <span>Customers</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/suppliers" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaTruckFront className={styles.icon} />
              {isOpen && <span>Suppliers</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/staffs" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaUserTie className={styles.icon} />
              {isOpen && <span>Staffs</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaClipboardList className={styles.icon} />
              {isOpen && <span>Orders</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaChartBar className={styles.icon} />
              {isOpen && <span>Reports</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/invoices" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaFileInvoice className={styles.icon} />
              {isOpen && <span>Invoices</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : undefined}>
              <FaUserCircle className={styles.icon} />
              {isOpen && <span>Profile</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
