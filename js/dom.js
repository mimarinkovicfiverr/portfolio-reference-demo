// Small shared helpers. Text always enters the page through textContent.
export function element(tag, className = '', text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Accept web links only. Reject javascript:, data:, credentials and malformed URLs.
export function safeWebUrl(value, allowedHost = '') {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    if (allowedHost && url.hostname !== allowedHost) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function externalLink(label, href) {
  const link = element('a', '', label);
  link.href = href;
  // Same-tab navigation is deliberate: no surprise new tabs or opener access.
  return link;
}
