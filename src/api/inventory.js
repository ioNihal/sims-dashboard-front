import callApi from "./_callApi";

export async function getAllInventoryItems(signal) {
  const { inventory = [] } = await callApi("/api/inventory/", { signal });
  return inventory;
}

export async function getInventoryItemById(id, signal) {
  const { inventory } = await callApi(`/api/inventory/${id}`, { signal });
  return inventory;
}

export async function addInventoryItem(payload) {
  const { inventory } = await callApi("/api/inventory", {
    method: "POST",
    body: payload,
  });
  return inventory;
}

export async function updateInventoryItem(id, updates) {
  const { inventory } = await callApi(`/api/inventory/${id}`, {
    method: "PATCH",
    body: updates,
  });
  return inventory;
}

export async function deleteInventoryItem(id) {
  await callApi(`/api/inventory/${id}`, { method: "DELETE" });
}
