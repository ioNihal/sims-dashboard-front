// pages/Staffs.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/PageStyles/Staffs/staffs.module.css";
import SearchBar from "../../components/SearchBar";

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const savedStaffs = localStorage.getItem("staffs");
    if (savedStaffs) {
      setStaffs(JSON.parse(savedStaffs));
    }
    setLoading(false);
  }, []);

  const handleDeleteStaff = (id) => {
    const updatedStaffs = staffs.filter((staff) => staff.id !== id);
    setStaffs(updatedStaffs);
    localStorage.setItem("staffs", JSON.stringify(updatedStaffs));
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      <h1>Staffs</h1>
      <div className={styles.actions}>
        {/* Navigate to the dynamic add staff page */}
        <button
          className={styles.addBtn}
          onClick={() => navigate("/staffs/add")}
        >
          Add Staff
        </button>
        <SearchBar
          placeholder="Search staffs..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <p className={styles.loading}>Loading Staffs...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.address}</td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => navigate(`/staffs/view/${staff.id}`)}
                    >
                      View
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/staffs/edit/${staff.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Staffs;
