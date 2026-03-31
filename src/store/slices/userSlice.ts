import { getProfile } from '@/apis/user';
import { IUserProfile } from '@/interfaces/user';
import axiosInstance, { endpoints } from '@/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getMe = createAsyncThunk(
    'user/getMe',
    async (_, { rejectWithValue }) => {
        try {
            // Thay bằng endpoint thực tế của bạn
            const response = await getProfile();
            return response.data; // Giả sử trả về IUserProfile
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);
interface UserState {
    user: IUserProfile | null;
}

const initialState: UserState = {
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserProfile>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMe.fulfilled, (state, action: PayloadAction<IUserProfile>) => {
            state.user = action.payload; // Tự động gán khi gọi thành công
        });
        builder.addCase(getMe.rejected, (state) => {
            state.user = null; // Xóa user nếu token hỏng/hết hạn
        });
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
