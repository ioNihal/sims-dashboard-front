
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";


/**
 * Fetches all orders from the backend API.
 */
export const getAllOrders = async () => {
    const res = await fetch(`${API_BASE}/api/orders`);
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch orders');
    }
    return json.orders;
};

/**
 * Fetches a single order by its ID.
 */
export async function getOrderById(orderId) {
    const response = await fetch(`${API_BASE}/api/orders?orderId=${orderId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch order');

    const [order] = data.orders;
    if (!order) throw new Error('Order not found');
    return order;
}

/**
 * Updates the status of an order.
 */
export async function updateOrderStatus(orderId, status) {
    if (!orderId) throw new Error('Order ID is required');
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || `Failed to update status for order ${orderId}`);
    }
    return data.order;
}

/**
 * Deletes an order by its ID.
 */
export async function deleteOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required');
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || `Failed to delete order ${orderId}`);
    }
}
