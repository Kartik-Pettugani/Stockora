async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed with status ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

export const api = {
  products: () => request('/api/products'),
  createProduct: (data) => request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
  suppliers: () => request('/api/suppliers'),
  createSupplier: (data) => request('/api/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  movements: () => request('/api/stock'),
  createMovement: (data) => request('/api/stock', { method: 'POST', body: JSON.stringify(data) }),
  dashboard: () => request('/api/dashboard'),
}
