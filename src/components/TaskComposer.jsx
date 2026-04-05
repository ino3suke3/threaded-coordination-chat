import React, { useEffect, useState } from "react";
import { badge, formatTimestamp, inferTaskTitle } from "../models/presenters";

export function TaskComposer({ selectedMessage, onCreateTask }) {
  const renderBadge = (item) => <span className={item.className}>{item.label}</span>;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [owner, setOwner] = useState("Sam");

  useEffect(() => {
    if (!selectedMessage) return;
    setTitle(inferTaskTitle(selectedMessage.body));
    setDescription(selectedMessage.body);
  }, [selectedMessage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedMessage || !title.trim()) return;
    onCreateTask({
      sourceMessageId: selectedMessage.id,
      title,
      description,
      priority,
      owner,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setOwner("Sam");
  };

  return (
    <>
      {selectedMessage ? (
        <div className="selected-card">
          <p className="eyebrow">Selected message</p>
          <div className="card-meta">
            {renderBadge(badge(selectedMessage.senderType))}
            {renderBadge(badge(formatTimestamp(selectedMessage.createdAt)))}
          </div>
          <p>{selectedMessage.body}</p>
        </div>
      ) : (
        <div className="empty-state">Select a message to create a task.</div>
      )}

      <form className="stack" onSubmit={handleSubmit}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Task description"
        />
        <div className="inline-grid">
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <select value={owner} onChange={(event) => setOwner(event.target.value)}>
            <option value="Sam">Sam</option>
            <option value="Agent">Agent</option>
            <option value="User">User</option>
          </select>
        </div>
        <button type="submit" disabled={!selectedMessage}>
          Create task from selected message
        </button>
      </form>
    </>
  );
}
