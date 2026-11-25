import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../services/service.js';

export const PAGE_SIZE = 12;
export const FRESH_FOR = 5 * 60 * 1000;
export const selectCatalog = (state) => state.catalog;
export const selectProducts = (state) => selectCatalog(state).products;

export const fetchCatalog = createAsyncThunk('catalog/fetch', async (_, { signal }) => ({
  ...await getProducts(signal), receivedAt: Date.now(),
}), {
  condition: (force, { getState }) => {
    const { requestId, receivedAt, error } = selectCatalog(getState());
    return !requestId && (force || !!error || Date.now() - receivedAt >= FRESH_FOR);
  },
});

export default createSlice({
  name: 'catalog',
  initialState: { products: [], receivedAt: 0, cached: false, requestId: null, error: '' },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchCatalog.pending, (state, { meta }) => {
      state.requestId = meta.requestId;
      if (!state.receivedAt) state.error = '';
    })
    .addCase(fetchCatalog.fulfilled, (state, { meta, payload }) => {
      if (state.requestId !== meta.requestId) return;
      state.products = payload.data;
      state.receivedAt = payload.receivedAt;
      state.cached = payload.cached;
      state.requestId = null;
      state.error = '';
    })
    .addCase(fetchCatalog.rejected, (state, { meta, error }) => {
      if (state.requestId !== meta.requestId) return;
      state.requestId = null;
      state.error = error.message || 'Could not load products.';
    }),
}).reducer;

export const selectCategories = createSelector(
  [selectProducts],
  (products) => [...new Set(products.map((product) => product.category))].sort(),
);

const sorts = {
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

const selectFiltered = createSelector(
  [selectProducts, (_, search) => search, (_, _search, category) => category,
    (_, _search, _category, stock) => stock, (_, _search, _category, _stock, sort) => sort],
  (products, search, category, stock, sort) => {
    const query = search.toLowerCase();
    const matches = products.filter((product) =>
      product.title.toLowerCase().includes(query) &&
      (category === 'all' || product.category === category) &&
      (stock === 'all' || (stock === 'yes' ? product.stock > 0 : product.stock === 0)),
    );
    if (Object.hasOwn(sorts, sort)) matches.sort(sorts[sort]);
    return matches;
  },
);

export const selectCatalogPage = createSelector(
  [selectFiltered, (_, _search, _category, _stock, _sort, page) => page],
  (matches, page) => {
    const count = matches.length;
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const offset = (currentPage - 1) * PAGE_SIZE;
    return { count, totalPages, currentPage, visible: matches.slice(offset, offset + PAGE_SIZE) };
  },
);
