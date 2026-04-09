import { getCart } from '@/apis/cart';
import { ICart, ICartItem } from '@/interfaces/cart';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Định nghĩa cấu trúc State
interface CartState {
    cart: ICart | null;
    userId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    userId: null,
    isLoading: false,
    error: null,
};

// 2. Cập nhật Async Thunk để nhận userId làm đối số
export const fetchCartByUserId = createAsyncThunk(
    'cart/fetchCartByUserId',
    async (userId: string, { rejectWithValue }) => {
        try {
            // Truyền userId vào hàm API của bạn
            const response = await getCart(userId, undefined, 1, 10); 
            return response.data;
        } catch (err: any) {
            // Trả về lỗi nếu có
            return rejectWithValue(err.response?.data?.message || 'Lỗi khi tải giỏ hàng');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Action để clear giỏ hàng khi user logout
        clearCart: (state) => {
            state.cart = null;
            state.userId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartByUserId.fulfilled, (state, action: PayloadAction<ICart>) => {
                state.isLoading = false;
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(fetchCartByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;