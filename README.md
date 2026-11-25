# SimpleShop — Redux Toolkit Homework

**Live demo:** https://simpleshop-henna.vercel.app/

SimpleShop is a React app where users can browse products, search by name, filter by category and stock, and sort by price or rating. Users can also sign in and manage their own products on the Profile page.

## Redux Toolkit

I used Redux Toolkit to store data that is shared between pages. For example, the Products page and Dashboard use the same product list.

### Slices

- **`catalog`** stores the public product list, loading state, and errors.
- **`details`** stores product details by product ID.
- **`inventory`** stores the signed-in user's products. Users can add, edit, and delete these products. The data is saved in the current browser and kept separate for each account.

### Async thunks

- `fetchCatalog` loads the product list from DummyJSON.
- `fetchDetails` loads the details of one product.
- `fetchInventory` reads the user's products from browser storage.
- `changeInventory` adds, edits, or deletes a product and updates the list in Redux.

The slices use `extraReducers` to handle `pending`, `fulfilled`, and `rejected`. The app shows loading messages and errors and lets users retry failed product requests.

### Selectors

- `selectProducts` returns the product list.
- `selectDetails` returns the details for a product ID.
- `selectCategories` returns the sorted list of categories.
- `selectCatalogPage` returns the products for the current search, filters, sorting, and page.

`selectCategories` and `selectCatalogPage` use `createSelector` to reuse their results when the inputs stay the same.

## Run locally

Use Node.js 22. In the project folder, run:

```bash
npm ci
npm run dev
```

Open the address shown in the terminal. To use sign-in and the Profile page, copy `.env.example` to `.env.local` and fill in your Firebase settings.

## Test offline mode

```bash
npm run build
npm run preview
```

Open the preview, visit the Products page and a product details page while online, then go offline and reload those pages. The service worker can show product data that was saved during the online visit.