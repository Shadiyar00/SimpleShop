import { useState } from 'react';
import useInventory from '../hooks/useInventory.js';

const EMPTY = { title: '', price: '', description: '' };

export default function PersonalInventory({ uid }) {
  const { items, loaded, loading, saving, error, refresh, change } = useInventory(uid);
  const [fields, setFields] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const disabled = saving || loading;

  function resetForm() {
    setFields(EMPTY);
    setEditing(null);
  }

  function updateField({ target }) {
    setFields({ ...fields, [target.name]: target.value });
  }

  async function submit(event) {
    event.preventDefault();
    try {
      await change(editing ? 'update' : 'create', editing, fields);
      resetForm();
    } catch {
      // The slice displays the error and the form keeps its values.
    }
  }

  async function remove(id) {
    try {
      await change('delete', id);
      if (editing === id) resetForm();
      setPendingDelete(null);
    } catch {
      // The confirmation stays visible so the user can retry.
    }
  }

  return <section className="panel inventory">
    <h2>My products</h2>
    <p>Products you add here are saved for your account in this browser.</p>
    {loading && !loaded && <p role="status">Loading your products…</p>}
    {error && <p className="message error" role="alert">{error}</p>}
    {error && !loaded && <button className="button" onClick={refresh}>Try again</button>}
    {loaded && <>
      <form onSubmit={submit}>
        <fieldset disabled={disabled}>
          <legend>{editing ? 'Edit product' : 'Add product'}</legend>
          <label>Title<input required name="title" value={fields.title} onChange={updateField} maxLength={100} /></label>
          <label>Price ($)<input required name="price" type="number" min="0" step="0.01" value={fields.price} onChange={updateField} /></label>
          <label>Description<textarea name="description" value={fields.description} onChange={updateField} maxLength={500} /></label>
          <div className="actions">
            <button className="button">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}</button>
            {editing && <button className="button button-outline" type="button" onClick={resetForm}>Cancel edit</button>}
          </div>
        </fieldset>
      </form>
      {!items.length ? <p>No products added yet.</p> : <ul className="inventory-items">
        {items.map((item) => <li key={item.id}>
          <div><strong>{item.title}</strong> <span>${item.price.toFixed(2)}</span>{item.description && <p>{item.description}</p>}</div>
          <div className="actions">
            {pendingDelete === item.id ? <>
              <button className="button" disabled={disabled} onClick={() => remove(item.id)}>Confirm delete</button>
              <button className="button button-outline" disabled={disabled} onClick={() => setPendingDelete(null)}>Cancel</button>
            </> : <>
              <button className="button button-outline" disabled={disabled} onClick={() => {
                setEditing(item.id);
                setFields({ title: item.title, price: String(item.price), description: item.description });
              }}>Edit</button>
              <button className="button button-outline" disabled={disabled} onClick={() => setPendingDelete(item.id)}>Delete</button>
            </>}
          </div>
        </li>)}
      </ul>}
    </>}
  </section>;
}
