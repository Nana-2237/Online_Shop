import { api } from './api.js'

const SESSION_KEY = 'gaming_shop_session_id'

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export function trackEvent(token, eventType, payload = {}) {
  api.events.trackClick(token, {
    event_type: eventType,
    page: document.title || window.location.pathname,
    path: window.location.pathname,
    session_id: getSessionId(),
    ...payload,
  }).catch(() => {})
}

export function trackClick(token, buttonId, buttonText, metadata = {}) {
  trackEvent(token, 'button_click', {
    button_id: buttonId,
    button_text: buttonText,
    metadata,
  })
}
