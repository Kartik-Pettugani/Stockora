import { useCallback, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import StockHistory from './pages/StockHistory'
import { api } from './services/api'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [data, setData] = useState({ products: [], suppliers: [], movements: [], stats: null })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true)
    try {
      const [products, suppliers, movements, stats] = await Promise.all([api.products(), api.suppliers(), api.movements(), api.dashboard()])
      setData({ products, suppliers, movements, stats })
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => loadData(), 0)
    return () => window.clearTimeout(timer)
  }, [loadData])
  const mutate = async (operation) => {
    try {
      await operation()
      await loadData(true)
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }
  const createProduct = (payload) => mutate(() => api.createProduct(payload))
  const updateProduct = (id, payload) => mutate(() => api.updateProduct(id, payload))
  const deleteProduct = (product) => window.confirm(`Delete ${product.name}?`) && mutate(() => api.deleteProduct(product.id))
  const createSupplier = (payload) => mutate(() => api.createSupplier(payload))
  const createMovement = (payload) => mutate(() => api.createMovement(payload))

  const view = {
    dashboard: <Dashboard stats={data.stats} products={data.products} onNavigate={setActiveView} />,
    products: <Products products={data.products} suppliers={data.suppliers} onCreate={createProduct} onUpdate={updateProduct} onDelete={deleteProduct} />,
    suppliers: <Suppliers suppliers={data.suppliers} onCreate={createSupplier} />,
    stock: <StockHistory products={data.products} movements={data.movements} onCreate={createMovement} />,
  }[activeView]

  return <div className="app-shell"><Sidebar activeView={activeView} onNavigate={setActiveView} /><main className="main-content"><Header activeView={activeView} onRefresh={() => loadData(true)} refreshing={refreshing} />{error && <div className="error-banner">{error}<button onClick={() => setError('')}>Dismiss</button></div>}{loading ? <div className="loading-state"><span className="loader" />Loading inventory...</div> : view}</main></div>
}

export default App
