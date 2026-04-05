import React, { useState } from "react";
import { badge, formatTimestamp, statusBadge } from "../models/presenters";

export function ThreadView({
  thread,
  messages,
  selectedMessageId,
  onSelectMessage,
  onSubmitMessage,
}) {
  const renderBadge = (item) => <span className={item.className}>{item.label}</span>;
  const [body, setBody] = useState("");
  const [senderType, setSenderType] = useState("user");

  if (!thread) {
    return <div className="loading-screen">No thread selected.</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    onSubmitMessage({ threadId: thread.id, senderType, body });
    setBody("");
  };

  return (
    <>
      <div className="panel-head">
        <div>
          <p className="eyebrow">Thread</p>
          <h2>{thread.title}</h2>
        </div>
        <div className="thread-meta">
          {renderBadge(badge(thread.kind))}
          {renderBadge(statusBadge(thread.status))}
          {renderBadge(badge(thread.ownerRole))}
        </div>
      </div>

      <div className="thread-summary">
        <div className="summary-card">
          <p className="eyebrow">Summary</p>
          <p>{thread.summary}</p>
        </div>
      </div>

      <div className="message-list">
        {messages.map((message) => (
          <button
            key={message.id}
            type="button"
            className={`message-card ${message.id === selectedMessageId ? "active" : ""}`}
            onClick={() => onSelectMessage(message.id)}
          >
            <div className="card-meta">
              {renderBadge(badge(message.senderType))}
              {renderBadge(badge(formatTimestamp(message.createdAt)))}
            </div>
            <p>{message.body}</p>
          </button>
        ))}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <label htmlFor="messageInput" className="sr-only">
          Message
        </label>
        <textarea
          id="messageInput"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add a message to the selected thread"
        />
        <div className="composer-actions">
          <select value={senderType} onChange={(event) => setSenderType(event.target.value)}>
            <option value="user">user</option>
            <option value="sam">sam</option>
            <option value="agent">agent</option>
            <option value="system">system</option>
          </select>
          <button type="submit">Send message</button>
        </div>
      </form>
    </>
  );
}
