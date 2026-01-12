import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/backend-1.0-SNAPSHOT/api/points/';
axios.defaults.withCredentials = true;

export const fetchPoints = createAsyncThunk('points/fetch', async () => {
    const username = localStorage.getItem('user');
    const response = await axios.get(`/backend-1.0-SNAPSHOT/api/points?user=${username}`);
    return response.data;
});

export const addPoint = createAsyncThunk('points/add', async (pointData) => {
    const response = await axios.post(API_URL, pointData);
    return response.data;
});

export const clearPoints = createAsyncThunk('points/clear', async () => {
    const username = localStorage.getItem('user');
    await axios.delete(`/backend-1.0-SNAPSHOT/api/points?user=${username}`);
    return [];
});

const pointsSlice = createSlice({
    name: 'points',
    initialState: { items: [], status: 'idle' },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addPoint.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(clearPoints.fulfilled, (state) => { state.items = []; });
    },
});

export default pointsSlice.reducer;