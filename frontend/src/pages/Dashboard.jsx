import { ArrowUpRight, Clock3 } from 'lucide-react'
import StatCard from '../components/StatCard'
import ProductTable from '../components/ProductTable'

export default function Dashboard({ stats, products, onNavigate }) {
  const lowStock = products.filter((product) => product.quantity <= product.reorder_level)
  return <div className="page-stack">
    <section className="hero-strip"><div><span className="eyebrow light">THURSDAY / 16 OCTOBER 2026</span><h2>Good morning, your stock is in view.</h2><p>Keep the shelves moving. There are {lowStock.length} items that need a closer look today.</p></div><button className="button light-button" onClick={() => onNavigate('products')}>Review catalog <ArrowUpRight size={16} /></button></section>
    <section className="stats-grid">
      <StatCard type="products" label="Catalog items" value={stats?.total_products ?? '-'} detail="active products" trend={12} />
      <StatCard type="units" label="Units on hand" value={stats?.total_units ?? '-'} detail="across all locations" tone="blue" />
      <StatCard type="low" label="Needs attention" value={stats?.low_stock_products ?? '-'} detail="below reorder level" tone="orange" />
      <StatCard type="value" label="Inventory value" value={stats ? `$${Number(stats.total_inventory_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'} detail="current retail value" tone="purple" />
    </section>
    <section className="content-grid">
      <div className="panel wide-panel"><div className="panel-heading"><div><span className="eyebrow">CATALOG PULSE</span><h2>Recent products</h2></div><button className="text-button" onClick={() => onNavigate('products')}>View all <ArrowUpRight size={15} /></button></div><ProductTable products={products} compact /></div>
      <div className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">SIGNALS</span><h2>What to watch</h2></div><Clock3 size={18} className="muted" /></div>{lowStock.length ? lowStock.slice(0, 4).map((product) => <div className="signal" key={product.id}><span className="signal-mark">!</span><div><strong>{product.name}</strong><span>{product.quantity} units left · reorder at {product.reorder_level}</span></div></div>) : <div className="empty-state small">Everything is above its reorder level.</div>}</div>
    </section>
  </div>
}
