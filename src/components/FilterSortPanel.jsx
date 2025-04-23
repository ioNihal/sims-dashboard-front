import React from "react";
import styles from "../styles/ComponentStyles/filterSortPanel.module.css";
import { FiFilter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";

const FilterSortPanel = ({
    filters,
    setFilters,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    filterOptions,
    sortOptions
}) => {
    const handleFilterChange = (e) => {
        const [key, value] = e.target.value.split(":");
        if (value === "ALL") {
            setFilters((prev) => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        } else {
            setFilters((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleSortChange = (e) => {
        const [key, order] = e.target.value.split("-");
        setSortKey(key);
        setSortOrder(order);
    };

    return (
        <div className={styles.filterSortPanel}>
            <span className={styles.filterIcon}><FiFilter /></span>
            <span className={styles.sortIcon}><BiSort /></span>
            <select onChange={handleFilterChange} value="">
                <option value=""></option>
                {Object.entries(filterOptions).map(([key, values]) =>
                    values.map((value) => {
                        const isSelected = filters[key] === value;
                        return (
                            <option key={`${key}:${value}`} value={`${key}:${value}`}
                                selected={isSelected}
                                className={isSelected ? styles.selected : ""}>
                                {`${key}: ${value}`}
                            </option>
                        )
                    })
                )}
                <option disabled>──────────</option>
                {Object.keys(filterOptions).map((key) => (
                    <option key={`${key}:ALL`} value={`${key}:ALL`}>
                        Clear {key}
                    </option>
                ))}
            </select>

            <select onChange={handleSortChange} value={`${sortKey}-${sortOrder}`}>
                <option value="">Sort By</option>
                {sortOptions.map(({ label, key }) => {
                    const ascValue = `${key}-asc`;
                    const descValue = `${key}-desc`;
                    return (
                        <React.Fragment key={key}>
                            <option
                                value={ascValue}
                                className={ascValue === `${sortKey}-${sortOrder}` ? styles.selected : ""}
                            >
                                {label} ↑
                            </option>
                            <option
                                value={descValue}
                                className={descValue === `${sortKey}-${sortOrder}` ? styles.selected : ""}
                            >
                                {label} ↓
                            </option>
                        </React.Fragment>
                    );
                })}s
            </select>
        </div>
    );
};

export default FilterSortPanel;
