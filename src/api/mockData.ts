import type { StoreDto, FoodDto, FoodStoreDto } from '../types/store';
import type { UserProfile } from '../types/user';

export const MOCK_USER: UserProfile = {
    id: 'user-123',
    email: 'customer@food.com',
    name: 'Nguyễn Văn A',
    balance: 500000
};

export const MOCK_FOOD_TYPES = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Món Việt' },
    { id: 3, name: 'Dồ uống' }, // Fixed typo in previous code if any
    { id: 4, name: 'Thức ăn nhanh' },
];

export const MOCK_STORES: StoreDto[] = [
    {
        id: 1,
        name: 'Phở Hà Nội',
        address: '123 Nguyễn Huệ, Q1',
        imageSrc: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80',
        latitude: '10.123',
        longitude: '106.123',
    },
    {
        id: 2,
        name: 'Pizza Express',
        address: '456 Lê Lợi, Q1',
        imageSrc: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80',
        latitude: '10.124',
        longitude: '106.124',
    },
    {
        id: 3,
        name: 'Trà Sữa Koi',
        address: '789 Pasteur, Q3',
        imageSrc: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
        latitude: '10.125',
        longitude: '106.125',
    }
];

export const MOCK_FOODS: FoodDto[] = [
    { id: 1, name: 'Phở Bò Tái', foodTypeId: 2, foodTypeName: 'Món Việt', imageSrc: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80', isAvailable: true },
    { id: 2, name: 'Pizza Hải Sản', foodTypeId: 4, foodTypeName: 'Thức ăn nhanh', imageSrc: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', isAvailable: true },
    { id: 3, name: 'Trà Sữa Trân Châu', foodTypeId: 3, foodTypeName: 'Đồ uống', imageSrc: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', isAvailable: true },
    { id: 4, name: 'Bún Bò Huế', foodTypeId: 2, foodTypeName: 'Món Việt', imageSrc: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80', isAvailable: true },
];

export const MOCK_FOOD_STORES: FoodStoreDto[] = [
    { id: 'fs-1', storeId: 1, store: MOCK_STORES[0], foodId: 1, food: MOCK_FOODS[0], price: 45000 },
    { id: 'fs-2', storeId: 2, store: MOCK_STORES[1], foodId: 2, food: MOCK_FOODS[1], price: 89000 },
    { id: 'fs-3', storeId: 3, store: MOCK_STORES[2], foodId: 3, food: MOCK_FOODS[2], price: 35000 },
    { id: 'fs-4', storeId: 1, store: MOCK_STORES[0], foodId: 4, food: MOCK_FOODS[3], price: 55000 },
];
