import callApi from "./_callApi";

export async function getSuppliers() {
  const { supplier = [] } = await callApi("/api/supplier/");
  return supplier;
}

export async function getSupplier(id) {
  const { supplier } = await callApi(`/api/supplier/${id}`);
  return supplier;
}

export async function createSupplier(payload) {
  const body = await callApi("/api/supplier", {
    method: "POST",
    body: payload,
  });
  return body;
}

export async function updateSupplier(id, payload) {
  const body = await callApi(`/api/supplier/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return body;
}

export async function deleteSupplier(id) {
  await callApi(`/api/supplier/${id}`, { method: "DELETE" });
}
