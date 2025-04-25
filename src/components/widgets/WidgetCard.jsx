// src/components/WidgetCard.jsx
import React from "react";
import styles from "../../styles/widgets/WidgetCard.module.css";
import { Link } from "react-router-dom";

const WidgetCard = ({ title, value, description, link }) => {
  return (
    <Link to={link} className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
    </Link>
  );
};

export default WidgetCard;
