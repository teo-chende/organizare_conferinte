import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchUtilizatori = createAsyncThunk(
  'utilizatori/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/utilizatori');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const fetchRevieweri = createAsyncThunk(
  'utilizatori/fetchRevieweri',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/utilizatori/revieweri/disponibili');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

const utilizatoriSlice = createSlice({
  name: 'utilizatori',
  initialState: {
    utilizatori: [],
    revieweri: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUtilizatori.fulfilled, (state, action) => {
        state.utilizatori = action.payload;
      })
      .addCase(fetchRevieweri.fulfilled, (state, action) => {
        state.revieweri = action.payload;
      });
  }
});

export default utilizatoriSlice.reducer;