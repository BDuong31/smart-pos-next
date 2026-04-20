import { getProfile } from '@/apis/user';
import { IUserProfile, IUserProfileDetail } from '@/interfaces/user';
import { axiosInstance, endpoints } from '@/utils/axios';
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
    isLoading: boolean;
    user: IUserProfileDetail | null;
}

const initialState: UserState = {
    isLoading: false,
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserProfileDetail>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.rejected, (state) => {
            state.user = null; // Xóa user nếu token hỏng/hết hạn
            state.isLoading = false;
        });
        builder.addCase(getMe.fulfilled, (state, action: PayloadAction<IUserProfileDetail>) => {
            state.user = action.payload;
            state.isLoading = false;
        });
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
