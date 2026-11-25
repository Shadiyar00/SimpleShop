import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeInventory, fetchInventory, selectInventory } from '../features/inventory.js';
import { inventoryKey } from '../services/inventory.js';

export default function useInventory(uid) {
  const dispatch = useDispatch();
  const state = useSelector(selectInventory);
  const active = uid === state.uid;

  useEffect(() => {
    if (!active) return;
    const refresh = () => dispatch(fetchInventory(uid));
    function onStorage(event) {
      if (event.key === inventoryKey(uid) || event.key === null) refresh();
    }
    refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
    };
  }, [active, dispatch, uid]);

  return {
    items: active ? state.items : [],
    loaded: active && state.loaded,
    loading: !active || state.operation === 'read',
    saving: active && state.operation === 'write',
    error: active ? state.error : '',
    refresh: () => dispatch(fetchInventory(uid)),
    change: (operation, id, fields) => dispatch(changeInventory({ uid, operation, id, fields })).unwrap(),
  };
}
