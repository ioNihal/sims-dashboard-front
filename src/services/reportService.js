// src/services/reportService.js
import { getAllInventoryItems } from "../api/inventory"
import { getSuppliers }         from "../api/suppliers";
import { getAllCustomers }      from "../api/customers";
import { getAllOrders }         from "../api/orders";
import { getAllInvoices }       from "../api/invoice";

export async function fetchReportData(type, { startDate, endDate, customerId }) {
  switch (type) {
    case "Inventory":
      // raw inventory items
      return await getAllInventoryItems();

    case "Customers":
      // all orders filtered by customer & date
      return (await getAllOrders())
        .filter(o =>
          o.customerId._id === customerId &&
          new Date(o.createdAt) >= new Date(startDate) &&
          new Date(o.createdAt) <= new Date(endDate)
        );

    case "Orders":
      // all orders filtered by date
      return (await getAllOrders())
        .filter(o =>
          new Date(o.createdAt) >= new Date(startDate) &&
          new Date(o.createdAt) <= new Date(endDate)
        );

    case "Sales":
    case "Payments":
      // invoices array
      return await getAllInvoices();

    case "Suppliers":
      // raw suppliers
      return await getSuppliers();

    default:
      return [];
  }
}
