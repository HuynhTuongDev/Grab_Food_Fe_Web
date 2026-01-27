import type { LoginRequest, RegisterRequest } from "../../types/user";
import { MOCK_USER } from "../mockData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerAuthApi = {
    async login(data: LoginRequest) {
        await delay(800);
        // Simple mock check
        if (data.email) {
            return { data: { token: 'mock-token-xyz', user: MOCK_USER } };
        }
        throw new Error("Invalid credentials");
    },

    async register(_data: RegisterRequest) {
        await delay(800);
        return { data: { success: true } };
    },

    async profile() {
        await delay(300);
        return { data: MOCK_USER };
    },

    async signOut() {
        await delay(200);
        return { data: { success: true } };
    },

    async topUp(amount: number) {
        await delay(500);
        return { data: { balance: MOCK_USER.balance + amount } };
    },
};
