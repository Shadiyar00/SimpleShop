export const inventoryKey = (uid) => `simpleshop:inventory:${uid}`;

export function readInventory(uid) {
  const data = localStorage.getItem(inventoryKey(uid));
  return data ? JSON.parse(data) : [];
}

export async function saveInventory({ uid, operation, id, fields }) {
  const key = inventoryKey(uid);
  function update() {
    const items = readInventory(uid);
    let next;
    if (operation === 'delete') {
      next = items.filter((item) => item.id !== id);
    } else {
      const title = fields.title.trim();
      const price = Number(fields.price);
      if (!title || !fields.price.trim() || !Number.isFinite(price) || price < 0) {
        throw new Error('Enter a title and a valid price.');
      }
      const item = { id: id ?? crypto.randomUUID(), title, price, description: fields.description.trim() };
      if (operation === 'create') {
        next = [...items, item];
      } else {
        if (!items.some((product) => product.id === id)) throw new Error('This product was removed in another tab.');
        next = items.map((product) => product.id === id ? item : product);
      }
    }
    localStorage.setItem(key, JSON.stringify(next));
    return readInventory(uid);
  }
  return navigator.locks ? navigator.locks.request(key, update) : update();
}
