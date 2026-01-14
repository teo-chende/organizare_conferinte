import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchArticole = createAsyncThunk(
  'articole/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/articole', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const fetchArticolById = createAsyncThunk(
  'articole/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/articole/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const createArticol = createAsyncThunk(
  'articole/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/articole', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const uploadVersiune = createAsyncThunk(
  'articole/uploadVersiune',
  async ({ articolId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/articole/${articolId}/versiune`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const submitReview = createAsyncThunk(
  'articole/submitReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const fetchReviewsMele = createAsyncThunk(
  'articole/fetchReviewsMele',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews/mele');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

const articoleSlice = createSlice({
  name: 'articole',
  initialState: {
    articole: [],
    articolCurent: null,
    reviewsMele: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticole.fulfilled, (state, action) => {
        state.loading = false;
        state.articole = action.payload;
      })
      .addCase(fetchArticole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchArticolById.fulfilled, (state, action) => {
        state.articolCurent = action.payload;
      })
      .addCase(createArticol.fulfilled, (state, action) => {
        state.articole.push(action.payload);
      })
      .addCase(fetchReviewsMele.fulfilled, (state, action) => {
        state.reviewsMele = action.payload;
      });
  }
});

export const { clearError } = articoleSlice.actions;
export default articoleSlice.reducer;
