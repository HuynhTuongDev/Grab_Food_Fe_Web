import axiosClient from "../axiosClient";
import type { Cart } from "../../types/cart";

export const customerCartApi = {
    saveTempCart(cart: Cart) {
        return axiosClient.patch("/api/users/temp-data", cart);
    },

    clearTempCart() {
        return axiosClient.delete("/api/users/temp-data");
    },
};
