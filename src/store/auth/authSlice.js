import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        status: 'checking', //* 'authenticated', 'non-authenticated'
        user: {},
        errorMessage: undefined,
    },
    reducers: {
        
        onChecking: ( state ) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onLogin: ( state, action ) => {
            state.status = 'authenticated';
            state.user = action.payload;
            state.errorMessage = undefined;
        },
        onLogout: ( state, action ) => {
            state.status = 'non-authenticated';
            state.user = {};
            state.errorMessage = action.payload;
        },
        onClearErrorMessage: ( state ) => {
            state.errorMessage = undefined;
        }
    },
})

export const { onChecking, onLogin, onLogout, onClearErrorMessage } = authSlice.actions;