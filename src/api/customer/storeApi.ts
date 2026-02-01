import { MOCK_FOOD_STORES, MOCK_FOOD_TYPES, MOCK_STORES } from "../mockData";

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerStoreApi = {
    async getStores(name?: string) {
        await delay(500);
        let data = MOCK_STORES;
        if (name) {
            data = data.filter(s => s.name?.toLowerCase().includes(name.toLowerCase()));
        }
        return { data: { data } }; // Mock Axios Response Structure
    },

    async getStoreById(id: number) {
        await delay(500);
        const store = MOCK_STORES.find(s => s.id === id);
        return { data: store };
    },

    async getFoodStores(foodName?: string, foodTypeId?: number) {
        await delay(500);
        let data = MOCK_FOOD_STORES;
        if (foodName) {
            data = data.filter(fs => fs.food.name?.toLowerCase().includes(foodName.toLowerCase()));
        }
        if (foodTypeId && foodTypeId !== 1) { // 1 is 'All' in our mock
            data = data.filter(fs => fs.food.foodTypeId === foodTypeId);
        }
        return { data: { data } };
    },

    async getFoodTypes() {
        await delay(300);
        return { data: MOCK_FOOD_TYPES };
    },

    async getFoodById(id: string) {
        await delay(500);
        // However ProductDetail uses 'id'. Let's assume the ID passed is the FoodId or FoodStoreId. 
        // In HomePage we linked to `/product/${item.foodId}` which is a number.
        // But MOCK_FOOD_STORES has `foodId` (number).

        // Let's support finding by foodId for now to match HomePage link
        const found = MOCK_FOOD_STORES.find(fs => fs.foodId === Number(id));
        return { data: found };
    }
};
