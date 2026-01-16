import axiosClient from "../axiosClient";

export const customerOrderApi = {
    createOrder(cart: Record<string, number>) {
        return axiosClient.post("/api/orders", cart);
    },

    getOrderById(id: string) {
        return axiosClient.get(`/api/orders/${id}`);
    },

    getOrderHistory() {
        return axiosClient.get("/api/orders/history");
    },
};
