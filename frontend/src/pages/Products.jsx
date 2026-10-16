import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductTable from '../components/ProductTable'

export default function Products({ products, suppliers, onCreate, onUpdate, onDelete }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  return <div className="page-stack">
    <div className="toolbar"><label className="search-box table-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product, SKU, or category" /></label><button className="button primary" onClick={() => setEditing({})}><Plus size={17} /> Add product</button></div>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">{filtered.length} ITEMS</span><h2>Product catalog</h2></div><span className="muted">Sorted by recently added</span></div><ProductTable products={filtered} onEdit={setEditing} onDelete={onDelete} /></section>
    {editing && <ProductForm key={editing.id || 'new'} product={editing.id ? editing : null} suppliers={suppliers} onClose={() => setEditing(null)} onSubmit={async (data) => { if (editing.id) await onUpdate(editing.id, data); else await onCreate(data); setEditing(null) }} />}
  </div>
}
