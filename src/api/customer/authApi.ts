import axiosClient from "../axiosClient";
import type { LoginRequest, RegisterRequest } from "../../types/user";

export const customerAuthApi = {
    login(data: LoginRequest) {
        return axiosClient.post("/api/users/login", data);
    },

    register(data: RegisterRequest) {
        return axiosClient.post("/api/users/register", data);
    },

    profile() {
        return axiosClient.get("/api/users/profile");
    },

    signOut() {
        return axiosClient.get("/api/users/sign-out");
    },

    topUp(amount: number) {
        return axiosClient.put("/api/users/top-up", amount);
    },
};
