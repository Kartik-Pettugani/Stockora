import { Building2, Plus, UserRound } from 'lucide-react'
import { useState } from 'react'

export default function Suppliers({ suppliers, onCreate }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', phone: '' })
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => { event.preventDefault(); await onCreate(form); setForm({ name: '', contact_name: '', email: '', phone: '' }); setOpen(false) }
  return <div className="page-stack"><div className="toolbar"><div className="toolbar-note"><Building2 size={18} /><span>{suppliers.length} supplier relationships</span></div><button className="button primary" onClick={() => setOpen(!open)}><Plus size={17} /> Add supplier</button></div>
    {open && <section className="panel inline-form"><div className="panel-heading"><div><span className="eyebrow">NEW RELATIONSHIP</span><h2>Add supplier</h2></div></div><form onSubmit={submit}><div className="form-grid"><label>Company name<input required name="name" value={form.name} onChange={update} placeholder="Northstar Wholesale" /></label><label>Contact person<input name="contact_name" value={form.contact_name} onChange={update} placeholder="Alex Morgan" /></label></div><div className="form-grid"><label>Email<input type="email" name="email" value={form.email} onChange={update} placeholder="alex@example.com" /></label><label>Phone<input name="phone" value={form.phone} onChange={update} placeholder="+91 00000 00000" /></label></div><div className="form-actions"><button type="button" className="button secondary" onClick={() => setOpen(false)}>Cancel</button><button className="button primary">Save supplier</button></div></form></section>}
    <section className="supplier-grid">{suppliers.map((supplier) => <article className="supplier-card" key={supplier.id}><div className="supplier-avatar"><UserRound size={20} /></div><div><h3>{supplier.name}</h3><p>{supplier.contact_name || 'No contact assigned'}</p><span>{supplier.email || 'No email added'}</span></div><div className="supplier-status"><span className="status-dot" /> Active</div></article>)}{!suppliers.length && <div className="panel empty-state">No suppliers added yet.</div>}</section>
  </div>
}
