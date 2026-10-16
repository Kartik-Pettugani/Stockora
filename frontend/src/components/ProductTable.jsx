import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react'

export default function ProductTable({ products, onEdit, onDelete, compact = false }) {
  if (!products.length) return <div className="empty-state">No products yet. Add your first item to start tracking inventory.</div>
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>On hand</th><th>Unit price</th><th>State</th><th /></tr></thead>
        <tbody>
          {products.slice(0, compact ? 5 : undefined).map((product) => {
            const low = product.quantity <= product.reorder_level
            return <tr key={product.id}>
              <td><div className="product-name"><span className="product-tile">{product.name.slice(0, 1)}</span><span>{product.name}</span></div></td>
              <td className="muted mono">{product.sku}</td>
              <td className="muted">{product.category || 'Uncategorized'}</td>
              <td><strong>{product.quantity}</strong><span className="muted"> units</span></td>
              <td>${Number(product.unit_price).toFixed(2)}</td>
              <td><span className={`badge ${low ? 'warning' : 'healthy'}`}>{low ? 'Reorder soon' : 'Healthy'}</span></td>
              <td><div className="row-actions">
                {!compact && <button className="table-action" title="Edit product" onClick={() => onEdit(product)}><Edit3 size={15} /></button>}
                {!compact && <button className="table-action danger" title="Delete product" onClick={() => onDelete(product)}><Trash2 size={15} /></button>}
                {compact && <MoreHorizontal size={17} className="muted" />}
              </div></td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}
