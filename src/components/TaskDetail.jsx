import React, { useState } from "react";
import { badge, statusBadge } from "../models/presenters";

export function TaskDetail({
  task,
  plans,
  approvals,
  onAddPlan,
  onUpdatePlanStatus,
  onCreateApproval,
  onResolveApproval,
}) {
  const renderBadge = (item) => <span className={item.className}>{item.label}</span>;
  const [planText, setPlanText] = useState("");
  const [approvalTitle, setApprovalTitle] = useState("");
  const [approvalReason, setApprovalReason] = useState("");

  const handlePlanSubmit = (event) => {
    event.preventDefault();
    if (!task || !planText.trim()) return;
    onAddPlan(task.id, planText);
    setPlanText("");
  };

  const handleApprovalSubmit = (event) => {
    event.preventDefault();
    if (!task || !approvalTitle.trim() || !approvalReason.trim()) return;
    onCreateApproval(task.id, { title: approvalTitle, reason: approvalReason });
    setApprovalTitle("");
    setApprovalReason("");
  };

  if (!task) {
    return <div className="empty-state">Select a task to manage plans and approvals.</div>;
  }

  return (
    <>
      <div className="active-task-card">
        <div className="task-footer">
          {renderBadge(statusBadge(task.status))}
          {renderBadge(badge(task.priority))}
          {renderBadge(badge(task.owner))}
        </div>
        <p>{task.description}</p>

        <div className="plan-list">
          {plans.length ? (
            plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <div className="task-footer">
                  {renderBadge(badge(`step ${plan.orderIndex}`))}
                  {renderBadge(statusBadge(plan.status))}
                </div>
                <p>{plan.stepText}</p>
                <select value={plan.status} onChange={(event) => onUpdatePlanStatus(plan.id, event.target.value)}>
                  <option value="todo">todo</option>
                  <option value="in_progress">in_progress</option>
                  <option value="blocked">blocked</option>
                  <option value="done">done</option>
                </select>
              </div>
            ))
          ) : (
            <div className="empty-state inline-empty">No plan items yet.</div>
          )}
        </div>

        <div className="approval-list">
          {approvals.length ? (
            approvals.map((approval) => {
              const resolved = approval.status !== "pending";
              return (
                <div key={approval.id} className="approval-card">
                  <div className="task-footer">
                    {renderBadge(badge("approval"))}
                    {renderBadge(badge(approval.status))}
                    {approval.decision ? renderBadge(badge(approval.decision)) : null}
                  </div>
                  <h3>{approval.title}</h3>
                  <p>{approval.reason}</p>
                  <div className="approval-actions">
                    <button
                      type="button"
                      disabled={resolved}
                      onClick={() => onResolveApproval(approval.id, "yes")}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      disabled={resolved}
                      onClick={() => onResolveApproval(approval.id, "no")}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state inline-empty">No approvals yet.</div>
          )}
        </div>
      </div>

      <form className="stack" onSubmit={handlePlanSubmit}>
        <input
          value={planText}
          onChange={(event) => setPlanText(event.target.value)}
          placeholder="Add a plan step"
        />
        <button type="submit">Add plan item</button>
      </form>

      <form className="stack" onSubmit={handleApprovalSubmit}>
        <input
          value={approvalTitle}
          onChange={(event) => setApprovalTitle(event.target.value)}
          placeholder="Approval title"
        />
        <textarea
          value={approvalReason}
          onChange={(event) => setApprovalReason(event.target.value)}
          placeholder="Approval reason"
        />
        <button type="submit">Create approval</button>
      </form>
    </>
  );
}
