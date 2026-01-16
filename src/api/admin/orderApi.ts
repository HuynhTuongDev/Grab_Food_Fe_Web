import axiosClient from "../axiosClient";

export const adminOrderApi = {
    getOrderById(id: string) {
        return axiosClient.get(`/api/orders/${id}`);
    },

    getOrderHistory() {
        return axiosClient.get("/api/orders/history");
    },

    getAllOrders() {
        return axiosClient.get("/api/orders");
    },
};
