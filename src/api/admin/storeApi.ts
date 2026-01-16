import axiosClient from "../axiosClient";

export const adminStoreApi = {
    getStores(name?: string) {
        return axiosClient.get("/api/stores", {
            params: { Name: name },
        });
    },

    getStoreById(id: number) {
        return axiosClient.get(`/api/stores/${id}`);
    },

    getFoodStores(foodName?: string, foodTypeId?: number) {
        return axiosClient.get("/api/food-stores", {
            params: { FoodName: foodName, FoodTypeId: foodTypeId },
        });
    },

    getFoodTypes() {
        return axiosClient.get("/api/food-types");
    },
};
