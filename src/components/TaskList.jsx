import React from "react";
import { badge, statusBadge } from "../models/presenters";

export function TaskList({ tasks, selectedTaskId, onSelectTask, onUpdateStatus }) {
  const renderBadge = (item) => <span className={item.className}>{item.label}</span>;

  if (!tasks.length) {
    return <div className="empty-state">No tasks yet for this thread.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className={`task-card ${task.id === selectedTaskId ? "active" : ""}`}>
          <h3>{task.title}</h3>
          <p className="muted">{task.description}</p>
          <div className="task-footer">
            {renderBadge(statusBadge(task.status))}
            {renderBadge(badge(task.priority))}
            {renderBadge(badge(task.owner))}
          </div>
          <div className="task-actions">
            <select value={task.status} onChange={(event) => onUpdateStatus(task.id, event.target.value)}>
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="blocked">blocked</option>
              <option value="done">done</option>
            </select>
            <button type="button" className="ghost" onClick={() => onSelectTask(task.id)}>
              Open
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
