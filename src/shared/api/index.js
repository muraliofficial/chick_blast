const BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api'

let activeRequests = 0
const listeners = new Set()

export const apiLoadingEmitter = {
  subscribe(fn) {
    listeners.add(fn)
    fn(activeRequests)
    return () => listeners.delete(fn)
  },
  emit() {
    listeners.forEach((fn) => fn(activeRequests))
  },
}

function startRequest() {
  activeRequests++
  apiLoadingEmitter.emit()
}

function endRequest() {
  activeRequests = Math.max(0, activeRequests - 1)
  apiLoadingEmitter.emit()
}

async function request(url, options = {}) {
  startRequest()
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.error || 'Request failed')
    }

    return data
  } finally {
    endRequest()
  }
}

export const itemsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/items${query ? `?${query}` : ''}`)
  },
  getAllAdmin: () => request('/items/all'),
  create: (data) => request('/items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/items/${id}`, { method: 'DELETE' }),
}

export const ordersApi = {
  create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  refresh: () => request('/orders/refresh'),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/orders${query ? `?${query}` : ''}`)
  },
  getById: (id) => request(`/orders/${id}`),
  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deliver: (id, payment) =>
    request(`/orders/${id}/deliver`, { method: 'PATCH', body: JSON.stringify({ payment }) }),
}

export const dashboardApi = {
  itemCounts: (date) => {
    const query = date ? `?date=${date}` : ''
    return request(`/dashboard/item-counts${query}`)
  },
  orderGrowth: (month, year) => {
    const params = new URLSearchParams()
    if (month) params.set('month', month)
    if (year) params.set('year', year)
    const query = params.toString()
    return request(`/dashboard/order-growth${query ? `?${query}` : ''}`)
  },
}

export async function uploadImage(file) {
  startRequest()
  try {
    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data.url
  } finally {
    endRequest()
  }
}
