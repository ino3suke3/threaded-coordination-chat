import React from "react";
import { badge, statusBadge } from "../models/presenters";

export function ThreadList({ threads, selectedThreadId, onSelectThread }) {
  const renderBadge = (item) => <span className={item.className}>{item.label}</span>;

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <button
          key={thread.id}
          type="button"
          className={`thread-card ${thread.id === selectedThreadId ? "active" : ""}`}
          onClick={() => onSelectThread(thread.id)}
        >
          <h3>{thread.title}</h3>
          <p className="muted">{thread.summary}</p>
          <div className="card-meta">
            {renderBadge(badge(thread.kind))}
            {renderBadge(statusBadge(thread.status))}
            {renderBadge(badge(thread.ownerRole))}
          </div>
        </button>
      ))}
    </div>
  );
}
