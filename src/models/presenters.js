export function badge(text) {
  return {
    className: "badge",
    label: text,
  };
}

export function statusBadge(status) {
  return {
    className: `badge status-${status}`,
    label: status,
  };
}

export function formatTimestamp(value) {
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function inferTaskTitle(body) {
  const trimmed = body.trim();
  return trimmed.length <= 42 ? trimmed : `${trimmed.slice(0, 39)}...`;
}
