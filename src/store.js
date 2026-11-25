import { configureStore } from '@reduxjs/toolkit';
import catalog from './features/catalog.js';
import details from './features/details.js';
import inventory from './features/inventory.js';

export const store = configureStore({ reducer: { catalog, details, inventory } });
