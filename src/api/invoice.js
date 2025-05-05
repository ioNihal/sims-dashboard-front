import callApi from "./_callApi";

export async function getAllInvoices() {
  const { invoice } = await callApi("/api/invoice");
  return invoice;
}

export async function getInvoiceById(id) {
  const { invoice } = await callApi(`/api/invoice/${id}`);
  return invoice;
}

export async function generateInvoices(customerIds) {
  return await callApi("/api/invoice", {
    method: "POST",
    body: { customers: customerIds },
  });
}

export async function approveInvoice(id) {
  await callApi(`/api/invoice/${id}`, {
    method: "PATCH",
    body: { draft: false },
  });
}

export async function payInvoice(id, status) {
  await callApi(`/api/invoice/payment/status/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteInvoice(id) {
  await callApi(`/api/invoice/${id}`, { method: "DELETE" });
}
