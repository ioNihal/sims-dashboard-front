import callApi from "./_callApi";

export async function getAllOrders() {
  const { orders } = await callApi("/api/orders");
  return orders;
}

export async function getOrderById(orderId) {
  const { orders } = await callApi(`/api/orders?orderId=${orderId}`);
  const [order] = orders;
  if (!order) throw new Error("Order not found");
  return order;
}

export async function updateOrderStatus(orderId, status) {
  const { order } = await callApi(`/api/orders/${orderId}`, {
    method: "PATCH",
    body: { status },
  });
  return order;
}

export async function deleteOrder(orderId) {
  await callApi(`/api/orders/${orderId}`, { method: "DELETE"});
}
