import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProductById } from '../services/service.js';
import { FRESH_FOR } from './catalog.js';

const EMPTY = { product: null, receivedAt: 0, cached: false, error: '', requestId: null };
export const validProductId = (id) => typeof id === 'string' && /^[1-9]\d*$/.test(id);
export const selectDetails = (state, id) => validProductId(id) ? state.details[id] ?? EMPTY : EMPTY;

export const fetchDetails = createAsyncThunk('details/fetch', async ({ id }, { signal, rejectWithValue }) => {
  try {
    return { ...await getProductById(id, signal), receivedAt: Date.now() };
  } catch (error) {
    return rejectWithValue({ message: error.message, missing: error.status === 404 });
  }
}, {
  condition: ({ id, force }, { getState }) => {
    if (!validProductId(id)) return false;
    const { receivedAt, requestId, error } = selectDetails(getState(), id);
    return !requestId && (force || !!error || Date.now() - receivedAt >= FRESH_FOR);
  },
});

export default createSlice({
  name: 'details',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchDetails.pending, (state, { meta }) => {
      const { id } = meta.arg;
      if (!state[id] && Object.keys(state).length >= 64) {
        const oldest = Object.keys(state).filter((key) => !state[key].requestId)
          .sort((a, b) => state[a].receivedAt - state[b].receivedAt)[0];
        if (oldest) delete state[oldest];
      }
      const entry = state[id] ?? EMPTY;
      state[id] = { ...entry, requestId: meta.requestId };
    })
    .addCase(fetchDetails.fulfilled, (state, { meta, payload }) => {
      const entry = state[meta.arg.id];
      if (entry?.requestId !== meta.requestId) return;
      state[meta.arg.id] = {
        ...EMPTY, product: payload.data, receivedAt: payload.receivedAt, cached: payload.cached,
      };
    })
    .addCase(fetchDetails.rejected, (state, { meta, payload, error }) => {
      const entry = state[meta.arg.id];
      if (entry?.requestId !== meta.requestId) return;
      entry.requestId = null;
      entry.error = payload?.message || error.message || 'Could not load product.';
      if (payload?.missing) entry.product = null;
    }),
}).reducer;
