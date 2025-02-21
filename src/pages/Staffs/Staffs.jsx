// pages/Staffs.js
import React, { useState, useEffect } from "react";
import styles from "../../styles/PageStyles/Staffs/staffs.module.css";
import SearchBar from "../../components/SearchBar";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal";

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedStaffs = localStorage.getItem("staffs");
    if (savedStaffs) {
      setStaffs(JSON.parse(savedStaffs));
      setLoading(false);
    } else {
      const staffs = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", address: "123 Main St", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", address: "456 Oak St", status: "Inactive" },
        { id: 3, name: "Alice Brown", email: "alice@example.com", phone: "555-678-1234", address: "789 Pine St", status: "Active" },
        { id: 4, name: "Arun Kumar", email: "arun.kumar@example.com", phone: "944-123-4567", address: "MG Road, Kochi, Kerala", status: "Active" },
        { id: 5, name: "Meera Nair", email: "meera.nair@example.com", phone: "984-567-8901", address: "Trivandrum, Kerala", status: "Inactive" },
        { id: 6, name: "Ravi Menon", email: "ravi.menon@example.com", phone: "987-654-4321", address: "Calicut, Kerala", status: "Active" },
        { id: 7, name: "Lakshmi Pillai", email: "lakshmi.p@example.com", phone: "963-852-7410", address: "Kottayam, Kerala", status: "Active" },
        { id: 8, name: "Suresh Balan", email: "suresh.balan@example.com", phone: "900-123-9876", address: "Ernakulam, Kerala", status: "Inactive" },
        { id: 9, name: "Anjali Raj", email: "anjali.raj@example.com", phone: "811-223-4455", address: "Thrissur, Kerala", status: "Active" },
        { id: 10, name: "Vishnu Das", email: "vishnu.das@example.com", phone: "889-556-2233", address: "Palakkad, Kerala", status: "Inactive" },
        { id: 11, name: "Reshma K", email: "reshma.k@example.com", phone: "807-332-1199", address: "Alappuzha, Kerala", status: "Active" },
        { id: 12, name: "Manoj Varma", email: "manoj.varma@example.com", phone: "812-667-3344", address: "Kannur, Kerala", status: "Inactive" },
        { id: 13, name: "Deepak R", email: "deepak.r@example.com", phone: "909-876-5432", address: "Kasaragod, Kerala", status: "Active" },
        { id: 14, name: "Neha Thomas", email: "neha.thomas@example.com", phone: "798-665-4321", address: "Kollam, Kerala", status: "Inactive" },
        { id: 15, name: "Prakash Iyer", email: "prakash.iyer@example.com", phone: "701-998-7766", address: "Malappuram, Kerala", status: "Active" },
      ];
      setTimeout(() => {
        setStaffs(staffs);
        localStorage.setItem("staffs", JSON.stringify(staffs));
        setLoading(false);
      }, 1000);
    }
  }, []);


  const handleAddStaff = (newStaff) => {
    const emailExists = staffs.some((s) => s.email === newStaff.email);

    if (emailExists) {
      alert("This email is already in use. Please use a different email.");
      return;
    }

    const updatedStaff = [...staffs, { ...newStaff, id: Date.now() }];
    setStaffs(updatedStaff);
    localStorage.setItem("staffs", JSON.stringify(updatedStaff));
    setIsAddModalOpen(false);
  };


  const handleEditStaff = (updatedStaff) => {
    const updatedStaffs = staffs.map((staff) =>
      staff.id === updatedStaff.id ? updatedStaff : staff
    );
    setStaffs(updatedStaffs);
    localStorage.setItem("staffs", JSON.stringify(updatedStaffs));
    setIsEditModalOpen(false);
  };

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
        <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>Add Staff</button>
        <SearchBar
          placeholder="Search staffs..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {isAddModalOpen && <AddStaffModal onAddStaff={handleAddStaff} onCancel={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <EditStaffModal staff={selectedStaff} onSave={handleEditStaff} onCancel={() => setIsEditModalOpen(false)} />}

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
                    <button className={styles.editBtn} onClick={() => {
                      setSelectedStaff(staff);
                      setIsEditModalOpen(true);
                    }}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteStaff(staff.id)}>Delete</button>
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
