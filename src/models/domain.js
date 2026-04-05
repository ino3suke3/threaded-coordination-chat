export function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createMessageRecord({ id, threadId, senderType, body }) {
  return {
    id,
    threadId,
    senderType,
    body,
    createdAt: new Date().toISOString(),
  };
}

export function createTaskRecord({ id, threadId, sourceMessageId, title, description, priority, owner }) {
  return {
    id,
    threadId,
    sourceMessageId,
    title,
    description,
    status: "todo",
    priority,
    owner,
  };
}

export function createPlanRecord({ id, threadId, taskId, stepText, orderIndex }) {
  return {
    id,
    threadId,
    taskId,
    stepText,
    status: "todo",
    orderIndex,
  };
}

export function createApprovalRecord({ id, threadId, taskId, title, reason }) {
  return {
    id,
    threadId,
    taskId,
    title,
    reason,
    status: "pending",
    decision: null,
  };
}

export function deriveThreadStatus(tasks) {
  if (!tasks.length) return "todo";
  if (tasks.some((task) => task.status === "blocked")) return "blocked";
  if (tasks.every((task) => task.status === "done")) return "done";
  if (tasks.some((task) => task.status === "in_progress" || task.status === "done")) {
    return "in_progress";
  }
  return "todo";
}
