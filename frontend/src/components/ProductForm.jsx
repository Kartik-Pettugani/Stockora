import { X } from 'lucide-react'
import { useState } from 'react'

const blank = { sku: '', name: '', category: '', description: '', unit_price: 0, quantity: 0, reorder_level: 0, supplier_id: null }

export default function ProductForm({ product, suppliers, onSubmit, onClose }) {
  const [form, setForm] = useState(product ? { ...product } : blank)
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...form, unit_price: Number(form.unit_price), quantity: Number(form.quantity), reorder_level: Number(form.reorder_level), supplier_id: form.supplier_id ? Number(form.supplier_id) : null })
  }
  return <div className="form-panel">
    <div className="panel-heading"><div><span className="eyebrow">CATALOG ENTRY</span><h2>{product ? 'Edit product' : 'Add product'}</h2></div><button className="icon-button" title="Close form" onClick={onClose}><X size={18} /></button></div>
    <form onSubmit={submit}>
      <div className="form-grid"><label>Product name<input required name="name" value={form.name} onChange={update} placeholder="e.g. Thermal labels" /></label><label>SKU<input required name="sku" value={form.sku} onChange={update} placeholder="STK-001" /></label></div>
      <div className="form-grid"><label>Category<input name="category" value={form.category} onChange={update} placeholder="Packaging" /></label><label>Supplier<select name="supplier_id" value={form.supplier_id || ''} onChange={update}><option value="">No supplier</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label></div>
      <label>Description<textarea name="description" value={form.description} onChange={update} rows="3" placeholder="Short product description" /></label>
      <div className="form-grid three"><label>Unit price<input type="number" min="0" step="0.01" name="unit_price" value={form.unit_price} onChange={update} /></label><label>Quantity<input type="number" min="0" name="quantity" value={form.quantity} onChange={update} /></label><label>Reorder at<input type="number" min="0" name="reorder_level" value={form.reorder_level} onChange={update} /></label></div>
      <div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit">{product ? 'Save changes' : 'Create product'}</button></div>
    </form>
  </div>
}
