// Generated from Swagger definition

export interface FoodDto {
    id: number;
    name?: string;
    foodTypeId: number;
    foodTypeName?: string;
    imageSrc?: string;
    isAvailable: boolean;
}

export interface FoodRequest {
    imageSrc?: string;
    foodTypeId: number;
}

export interface FoodUpdate {
    imageSrc?: string;
    foodTypeId: number;
    isAvaiable: boolean;
}

export interface StoreDto {
    id: number;
    tenantId: number;
    name?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    imageSrc?: string;
    foodStores?: FoodStoreDto[];
}

export interface FoodStoreDto {
    id: string; // uuid
    storeId: number;
    store?: StoreDto;
    foodId: number;
    food?: FoodDto;
    price: number;
}

export interface FoodTypeCreateRequest {
    name: string;
    imgSrc?: string;
}

export interface FoodTypeUpdateRequest {
    id: number;
    name: string;
    imgSrc?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface UserProfileDto { // Inferred name
    id: string;
    email: string;
    name: string;
    balance: number;
}

export interface CartItemDto {
    quantity: number;
    foodStore?: FoodStoreDto;
}

export interface CartDto {
    orderList: Record<string, CartItemDto>;
}

export interface TenantRequest {
    name?: string;
}

export interface TenantUpdateRequest {
    id: number;
    name?: string;
}
