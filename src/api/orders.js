const API_BASE = 'https://suims.vercel.app';

/**
 * Fetches all orders from the backend API.
 */
export const getAllOrders = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/orders`);
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.error?.message || 'Failed to fetch orders');
        }
        return json.orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // <-- This is important to allow the caller to handle it
    }
};

/**
 * Fetches a single order by its ID.
 */
export async function getOrderById(orderId) {
    try {
        const response = await fetch(`${API_BASE}/api/orders?orderId=${orderId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch order');

        const [order] = data.orders;
        if (!order) throw new Error('Order not found');
        return order;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
    }
}

/**
 * Updates the status of an order.
 */
export async function updateOrderStatus(orderId, status) {
    if (!orderId) throw new Error('Order ID is required');
    try {
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
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

/**
 * Deletes an order by its ID.
 */
export async function deleteOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required');
    try {
        const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Failed to delete order ${orderId}`);
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
}
