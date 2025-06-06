
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Inventory from './pages/Inventory/Inventory';
import Customers from './pages/Customers/Customers';
import Orders from './pages/Orders/Orders';
import Reports from './pages/Reports/Reports';
import Suppliers from './pages/Suppliers/Suppliers';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ItemDetails from './pages/Inventory/ItemDetails';
import SupplierDetail from './pages/Suppliers/SupplierDetail';
import AddSupplierModal from './pages/Suppliers/AddSupplierModal';
import EditSupplierModal from './pages/Suppliers/EditSupplierModal';
import AddItemPage from './pages/Inventory/AddItemPage';
import EditItemPage from './pages/Inventory/EditItemPage';
import AddCustomerPage from './pages/Customers/AddCustomerPage';
import EditCustomerPage from './pages/Customers/EditCustomerPage';
import CustomerDetails from './pages/Customers/CustomerDetails';
import OrderDetails from './pages/Orders/OrderDetails';
import ReportDetails from './pages/Reports/ReportDetails';
import AddReportPage from './pages/Reports/AddReportPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Invoices from './pages/Invoices/Invoices';
import InvoiceDetails from './pages/Invoices/InvoiceDetails';
import ProfileWidget from "./components/widgets/ProfileWidget";
import Feedbacks from './pages/Feedbacks/Feedbacks';
import { ThemeToggleButton } from './components/ThemeToggleButton';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';


function App() {

  let user;
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      user = JSON.parse(stored);
    } catch (_e) {
      console.warn("Corrupt user in storage, resetting to default");
      user = { name: "Admin", id: "DEFAULT_ID", avatarUrl: "…" };
    }
  } else {
    user = { name: "Admin", id: "DEFAULT_ID", avatarUrl: "…" };
  }


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Toaster
                position="top-center"
                toastOptions={{
                  success: { style: { background: 'green', color: 'white' } },
                  error: { style: { background: 'red', color: 'white' } },
                }}
              />
              <div className="dashboard">
                <Sidebar />
                <div className="main">
                  <div className="topbar" >
                    <ThemeToggleButton />
                    <ProfileWidget user={user} />
                  </div>
                  <div className="content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/inventory/:id" element={<ItemDetails />} />
                      <Route path="/inventory/edit/:id" element={<EditItemPage />} />
                      <Route path="/inventory/add" element={<AddItemPage />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/customers/add" element={<AddCustomerPage />} />
                      <Route path="/customers/edit/:id" element={<EditCustomerPage />} />
                      <Route path="/customers/view/:id" element={<CustomerDetails />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/suppliers/view/:id" element={<SupplierDetail />} />
                      <Route path="/suppliers/add" element={<AddSupplierModal />} />
                      <Route path="/suppliers/edit/:supplierId" element={<EditSupplierModal />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/orders/:id" element={<OrderDetails />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/reports/add" element={<AddReportPage />} />
                      <Route path="/reports/view/:id" element={<ReportDetails />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/invoice/view/:id" element={<InvoiceDetails />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/feedbacks" element={<Feedbacks />} />
                      <Route path="*" element={<NotFound />} />

                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
