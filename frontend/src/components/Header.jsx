import { Bell, RefreshCw, Search } from 'lucide-react'

const titles = {
  dashboard: ['Inventory overview', 'A clear read on what is moving and what needs attention.'],
  products: ['Products', 'Manage catalog details, quantities, and reorder thresholds.'],
  suppliers: ['Suppliers', 'Keep vendor relationships and contact details close at hand.'],
  stock: ['Stock history', 'Record inventory movement and trace every adjustment.'],
}

export default function Header({ activeView, onRefresh, refreshing }) {
  const [title, subtitle] = titles[activeView]
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">STOCKORA / {activeView.toUpperCase()}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={17} />
          <input aria-label="Search" placeholder="Search inventory" />
        </label>
        <button className="icon-button" title="Refresh data" onClick={onRefresh} disabled={refreshing}>
          <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
        </button>
        <button className="icon-button" title="Notifications"><Bell size={18} /></button>
        <div className="avatar">SO</div>
      </div>
    </header>
  )
}
