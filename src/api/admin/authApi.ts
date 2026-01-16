import axiosClient from "../axiosClient";

export const adminAuthApi = {
    getUserProfile() {
        return axiosClient.get("/api/users/profile");
    },

    signOut() {
        return axiosClient.get("/api/users/sign-out");
    },
};
