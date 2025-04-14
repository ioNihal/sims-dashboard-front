// src/components/WidgetCard.jsx
import React from "react";
import styles from "../styles/widgets/WidgetCard.module.css";
import { Link } from "react-router-dom";

const WidgetCard = ({ title, value, description, link }) => {
  return (
    <Link to={link} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
      {description && <p className={styles.description}>{description}</p>}
    </Link>
  );
};

export default WidgetCard;
