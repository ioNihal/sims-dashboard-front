const API_BASE = 'https://suims.vercel.app';


/**
 * Fetches all orders from the backend API.
 *
 * @async
 * @function getAllOrders
 * @returns {Promise<Object[]>} A promise that resolves to an array of order objects.
 * @throws {Error} Throws an error if the API call fails.
 */
export const getAllOrders = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/orders`);
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.message || 'Failed to fetch orders');
        }
        return json.orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};


/**
 * Fetches a single order by its ID.
 *
 * @async
 * @function getOrderById
 * @param {string} orderId - The unique identifier of the order.
 * @returns {Promise<Object>} A promise that resolves to the order object.
 * @throws {Error} Throws an error if the network request fails or the server returns a non-OK status.
 */
export async function getOrderById(orderId) {

    const response = await fetch(`${API_BASE}/api/orders?orderId=${orderId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    const [order] = data.orders;
    if (!order) throw new Error('Order not found');
    return order;
}




/**
 * Updates the status of an order.
 *
 * @async
 * @function updateOrderStatus
 * @param {string} orderId - The unique identifier of the order.
 * @param {string} status - The new status to set ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').
 * @returns {Promise<Object>} A promise that resolves to the updated order object.
 * @throws {Error} Throws an error if the network request fails or the server returns a non-OK status.
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
        throw new Error(data.message || `Failed to update status for order ${orderId}`);
    }
    return data.order;
}

/**
 * Deletes an order by its ID.
 *
 * @async
 * @function deleteOrder
 * @param {string} orderId - The unique identifier of the order.
 * @returns {Promise<void>} A promise that resolves when deletion is successful.
 * @throws {Error} Throws an error if the network request fails or the server returns a non-OK status.
 */
export async function deleteOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required');
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `Failed to delete order ${orderId}`);
    }
}
