
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetch all invoices.
 * @returns {Promise<Array>} List of invoices.
 * @throws {Error} If the fetch fails.
 */
export async function getAllInvoices() {
  const res = await fetch(`${API_BASE}/api/invoice`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to load invoices");
  return data.invoice;
}

/**
 * Fetch a specific invoice by ID.
 * @param {string} id - The invoice ID.
 * @returns {Promise<Object>} The invoice object.
 * @throws {Error} If the fetch fails.
 */
export async function getInvoiceById(id) {
  const res = await fetch(`${API_BASE}/api/invoice/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error.message || "Failed to load invoice");
  return data.invoice;
}

/**
 * Generate invoices for customers.
 * @param {string[]} customerIds - Array of customer IDs.
 * @returns {Promise<Object>} The response object.
 * @throws {Error} If generation fails.
 */
export async function generateInvoices(customerIds) {
  const res = await fetch(`${API_BASE}/api/invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customers: customerIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Invoice generation failed");
  return data;
}

/**
 * Approve a draft invoice.
 * @param {string} id - The invoice ID.
 * @returns {Promise<void>}
 * @throws {Error} If approval fails.
 */
export async function approveInvoice(id) {
  const res = await fetch(`${API_BASE}/api/invoice/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ draft: false }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error.message || "Approval failed");
  }
}

/**
 * Mark an invoice as paid.
 * @param {string} id - The invoice ID.
 * @param {string} transactionId - The UPI transaction ID.
 * @returns {Promise<void>}
 * @throws {Error} If payment update fails.
 */
export async function payInvoice(id, status) {
  const res = await fetch(`${API_BASE}/api/invoice/payment/status/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: status
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error.message || "Payment update failed");
  }
}


/**
 * Delete an invoice.
 * @param {string} id - The invoice ID.
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails.
 */
export async function deleteInvoice(id) {
  const res = await fetch(`${API_BASE}/api/invoice/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error?.message || "Failed to delete invoice");
  }
}