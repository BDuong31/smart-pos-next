import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
        }
    }
})

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;