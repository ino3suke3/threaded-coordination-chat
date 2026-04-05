import React from "react";

export function StatusSnapshot({ snapshot }) {
  if (!snapshot) return <div className="empty-state">No snapshot available.</div>;

  const cards = [
    { label: "Open tasks", value: snapshot.openTasks },
    { label: "Blocked tasks", value: snapshot.blockedTasks },
    { label: "Pending approvals", value: snapshot.pendingApprovals },
    { label: "Messages", value: snapshot.messageCount },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className="stat-card">
          <span className="eyebrow">{card.label}</span>
          <strong>{card.value}</strong>
        </div>
      ))}
    </div>
  );
}
