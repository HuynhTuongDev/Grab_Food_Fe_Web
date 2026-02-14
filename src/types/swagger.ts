// Generated from Swagger definition

export interface FoodDto {
    id: number;
    name?: string;
    foodTypeId: number;
    foodTypeName?: string;
    imageSrc?: string;
    isAvailable: boolean;
    price?: number;
}

export interface FoodRequest {
    name: string;
    imageSrc?: string;
    foodTypeId: number;
    price: number;
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
    roleName?: string;
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

export interface OrderDto {
    id: string;
    totalAmount: number;
    orderDate: string;
    status: 'New' | 'Preparing' | 'Ready' | 'Delivering' | 'Completed' | 'Cancelled';
    user?: { name: string; phone: string; };
    orderDetails?: OrderItemDto[];
    note?: string;
    driverName?: string;
}

export interface OrderItemDto {
    quantity: number;
    price: number;
    foodName?: string;
}

export interface AddressDto {
    id: number;
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    isDefault: boolean;
}

export interface AddressRequest {
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    isDefault?: boolean;
}

export interface ReviewDto {
    id: number;
    userId: string;
    userName: string;
    foodId?: number;
    storeId?: number;
    rating: number;
    comment: string;
    createdAt: string;
    reply?: string;
}

export interface ReviewRequest {
    foodId?: number;
    storeId?: number;
    rating: number;
    comment: string;
}

export interface VoucherDto {
    id: number;
    code: string;
    discountPercent: number;
    maxDiscountAmount: number;
    minOrderAmount: number;
    expiryDate: string;
    isActive: boolean;
}

export interface NotificationDto {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type?: string;
}

export interface WalletTransactionDto {
    id: string;
    amount: number;
    type: 'Deposit' | 'Payment' | 'Refund';
    description: string;
    createdAt: string;
    status: 'Success' | 'Failed' | 'Pending';
}

export interface TenantDto {
    id: number;
    name: string;
    ownerId?: string;
    address?: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
}

