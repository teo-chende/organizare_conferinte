import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchConferinte = createAsyncThunk(
  'conferinte/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/conferinte');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const fetchConferintaById = createAsyncThunk(
  'conferinte/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conferinte/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const createConferinta = createAsyncThunk(
  'conferinte/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/conferinte', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

export const alocaRevieweri = createAsyncThunk(
  'conferinte/alocaRevieweri',
  async ({ conferintaId, reviewerIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/conferinte/${conferintaId}/revieweri`, { reviewerIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Eroare');
    }
  }
);

const conferinteSlice = createSlice({
  name: 'conferinte',
  initialState: {
    conferinte: [],
    conferintaCurenta: null,
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
      .addCase(fetchConferinte.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConferinte.fulfilled, (state, action) => {
        state.loading = false;
        state.conferinte = action.payload;
      })
      .addCase(fetchConferinte.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConferintaById.fulfilled, (state, action) => {
        state.conferintaCurenta = action.payload;
      })
      .addCase(createConferinta.fulfilled, (state, action) => {
        state.conferinte.push(action.payload);
      })
      .addCase(alocaRevieweri.fulfilled, (state, action) => {
        const index = state.conferinte.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.conferinte[index] = action.payload;
        }
      });
  }
});

export const { clearError } = conferinteSlice.actions;
export default conferinteSlice.reducer;