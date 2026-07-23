const API_BASE = import.meta.env.VITE_API_URL || '/api'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

function trackingHeaders(token) {
  return token ? { ...authHeaders(token), 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

export const api = {
  auth: {
    register: (data) =>
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    login: (email, password) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
      }),
    me: (token) =>
      fetch(`${API_BASE}/auth/me`, { headers: authHeaders(token) }),
  },
  products: {
    list: () => fetch(`${API_BASE}/products/`),
    create: (token, data) =>
      fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (token, id, data) =>
      fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    remove: (token, id) =>
      fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      }),
  },
  cart: {
    get: (token) => fetch(`${API_BASE}/cart/items`, { headers: authHeaders(token) }),
    add: (token, data) =>
      fetch(`${API_BASE}/cart/items`, {
        method: 'POST',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (token, id, data) =>
      fetch(`${API_BASE}/cart/items/${id}`, {
        method: 'PUT',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    remove: (token, id) =>
      fetch(`${API_BASE}/cart/items/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      }),
  },
  orders: {
    create: (token) =>
      fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: authHeaders(token),
      }),
    list: (token) => fetch(`${API_BASE}/orders/`, { headers: authHeaders(token) }),
    get: (token, id) => fetch(`${API_BASE}/orders/${id}`, { headers: authHeaders(token) }),
  },
  events: {
    trackClick: (token, data) =>
      fetch(`${API_BASE}/events/clicks`, {
        method: 'POST',
        headers: trackingHeaders(token),
        body: JSON.stringify(data),
        keepalive: true,
      }),
  },
  adminUsers: {
    list: (token) => fetch(`${API_BASE}/admin/users/`, { headers: authHeaders(token) }),
    create: (token, data) =>
      fetch(`${API_BASE}/admin/users/`, {
        method: 'POST',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (token, id, data) =>
      fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'PUT',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    remove: (token, id) =>
      fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      }),
  },
}
