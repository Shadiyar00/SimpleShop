import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { readInventory, saveInventory } from '../services/inventory.js';

const EMPTY = { uid: null, items: [], loaded: false, requestId: null, operation: null, error: '' };
export const selectInventory = (state) => state.inventory;

export const fetchInventory = createAsyncThunk('inventory/read', (uid) => readInventory(uid), {
  condition: (uid, { getState }) => {
    const state = selectInventory(getState());
    return state.uid === uid && !state.requestId;
  },
});

export const changeInventory = createAsyncThunk('inventory/change', saveInventory, {
  condition: ({ uid }, { getState }) => {
    const state = selectInventory(getState());
    return state.uid === uid && state.loaded && !state.requestId;
  },
});

const inventory = createSlice({
  name: 'inventory',
  initialState: EMPTY,
  reducers: {
    setInventoryOwner(state, { payload }) {
      if (state.uid !== payload) return { ...EMPTY, uid: payload };
    },
  },
  extraReducers: (builder) => {
    for (const [thunk, operation] of [[fetchInventory, 'read'], [changeInventory, 'write']]) {
      builder
        .addCase(thunk.pending, (state, { meta }) => {
          state.requestId = meta.requestId;
          state.operation = operation;
          state.error = '';
        })
        .addCase(thunk.fulfilled, (state, { meta, payload }) => {
          if (state.requestId !== meta.requestId) return;
          state.items = payload;
          state.loaded = true;
          state.requestId = null;
          state.operation = null;
        })
        .addCase(thunk.rejected, (state, { meta, error }) => {
          if (state.requestId !== meta.requestId) return;
          state.requestId = null;
          state.operation = null;
          state.error = error.message || 'Could not access your products.';
        });
    }
  },
});

export const { setInventoryOwner } = inventory.actions;
export default inventory.reducer;
