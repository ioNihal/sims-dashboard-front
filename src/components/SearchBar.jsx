// components/SearchBar.js
import React from "react";
import styles from "../styles/SearchBar/searchbar.module.css";

const SearchBar = ({ placeholder, searchQuery, setSearchQuery }) => {
  return (
    <input
      type="text"
      className={styles.searchInput}
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};

export default SearchBar;
