import { BarChart3, Boxes, ClipboardList, LayoutDashboard, Truck } from 'lucide-react'

const items = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'stock', label: 'Stock history', icon: ClipboardList },
]

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><BarChart3 size={20} /></span>
        <span>stockora</span>
      </div>
      <div className="workspace-label">OPERATIONS DESK</div>
      <nav aria-label="Main navigation">
        {items.map(({ id, label, icon: Icon }) => (
          <button className={`nav-item ${activeView === id ? 'active' : ''}`} key={id} onClick={() => onNavigate(id)}>
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footnote">
        <span className="status-dot" /> API connected through local gateway
      </div>
    </aside>
  )
}
