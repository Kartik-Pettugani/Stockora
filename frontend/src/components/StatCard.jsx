import { ArrowDownRight, ArrowUpRight, Boxes, CircleAlert, PackageCheck, Wallet } from 'lucide-react'

const icons = { products: Boxes, units: PackageCheck, low: CircleAlert, value: Wallet }

export default function StatCard({ label, value, detail, trend, tone = 'green', type }) {
  const Icon = icons[type] || Boxes
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-topline"><span>{label}</span><span className="stat-icon"><Icon size={18} /></span></div>
      <strong>{value}</strong>
      <div className="stat-detail">
        {trend && <span className={trend > 0 ? 'trend-up' : 'trend-down'}>{trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(trend)}%</span>}
        <span>{detail}</span>
      </div>
    </article>
  )
}
