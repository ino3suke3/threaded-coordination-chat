import { useEffect, useMemo, useReducer, useState } from "react";
import {
  createApprovalRecord,
  createMessageRecord,
  createPlanRecord,
  createTaskRecord,
  deriveThreadStatus,
  makeId,
} from "../models/domain";

const STORAGE_KEY = "sam-chat-poc-state-v2";

const initialUiState = {
  data: null,
  selection: {
    threadId: null,
    messageId: null,
    taskId: null,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "bootstrap": {
      const data = action.data;
      return {
        data,
        selection: {
          threadId: data.threads[0]?.id ?? null,
          messageId: null,
          taskId: data.tasks.find((task) => task.threadId === data.threads[0]?.id)?.id ?? null,
        },
      };
    }
    case "select-thread": {
      const threadId = action.threadId;
      const nextTask = state.data.tasks.find((task) => task.threadId === threadId)?.id ?? null;
      return {
        ...state,
        selection: {
          threadId,
          messageId: null,
          taskId: nextTask,
        },
      };
    }
    case "select-message":
      return {
        ...state,
        selection: {
          ...state.selection,
          messageId: action.messageId,
        },
      };
    case "select-task":
      return {
        ...state,
        selection: {
          ...state.selection,
          taskId: action.taskId,
        },
      };
    case "replace-data":
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}

export function useSamChatState() {
  const [uiState, dispatch] = useReducer(reducer, initialUiState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const cached = localStorage.getItem(STORAGE_KEY);
      const data = cached ? JSON.parse(cached) : await fetch("/seed.json").then((res) => res.json());
      if (!cancelled) {
        dispatch({ type: "bootstrap", data });
        setIsLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (uiState.data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uiState.data));
    }
  }, [uiState.data]);

  const derived = useMemo(() => {
    if (!uiState.data) {
      return {
        threads: [],
        selectedThread: null,
        selectedThreadMessages: [],
        selectedThreadTasks: [],
        selectedThreadSnapshot: null,
        selectedMessage: null,
        selectedTask: null,
        selectedTaskPlans: [],
        selectedTaskApprovals: [],
      };
    }

    const { threads, messages, tasks, plans, approvals } = uiState.data;
    const selectedThread = threads.find((thread) => thread.id === uiState.selection.threadId) ?? null;
    const selectedThreadMessages = messages
      .filter((message) => message.threadId === selectedThread?.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const selectedThreadTasks = tasks.filter((task) => task.threadId === selectedThread?.id);
    const selectedMessage = messages.find((message) => message.id === uiState.selection.messageId) ?? null;
    const selectedTask =
      tasks.find((task) => task.id === uiState.selection.taskId) ??
      selectedThreadTasks[0] ??
      null;
    const selectedTaskPlans = plans
      .filter((plan) => plan.taskId === selectedTask?.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    const selectedTaskApprovals = approvals.filter((approval) => approval.taskId === selectedTask?.id);

    const selectedThreadSnapshot = selectedThread
      ? {
          openTasks: selectedThreadTasks.filter((task) => task.status !== "done").length,
          blockedTasks: selectedThreadTasks.filter((task) => task.status === "blocked").length,
          pendingApprovals: approvals.filter(
            (approval) => approval.threadId === selectedThread.id && approval.status === "pending",
          ).length,
          messageCount: selectedThreadMessages.length,
        }
      : null;

    return {
      threads,
      selectedThread,
      selectedThreadMessages,
      selectedThreadTasks,
      selectedThreadSnapshot,
      selectedMessage,
      selectedTask,
      selectedTaskPlans,
      selectedTaskApprovals,
    };
  }, [uiState]);

  const actions = useMemo(
    () => ({
      selectThread(threadId) {
        dispatch({ type: "select-thread", threadId });
      },
      selectMessage(messageId) {
        dispatch({ type: "select-message", messageId });
      },
      selectTask(taskId) {
        dispatch({ type: "select-task", taskId });
      },
      createMessage({ threadId, senderType, body }) {
        const data = structuredClone(uiState.data);
        data.messages.push(createMessageRecord({ id: makeId("msg"), threadId, senderType, body }));
        dispatch({ type: "replace-data", data });
      },
      createTaskFromMessage({ sourceMessageId, title, description, priority, owner }) {
        const data = structuredClone(uiState.data);
        const sourceMessage = data.messages.find((message) => message.id === sourceMessageId);
        if (!sourceMessage) return;
        const task = createTaskRecord({
          id: makeId("task"),
          threadId: sourceMessage.threadId,
          sourceMessageId,
          title,
          description,
          priority,
          owner,
        });
        data.tasks.push(task);
        syncThreadStatuses(data);
        dispatch({ type: "replace-data", data });
        dispatch({ type: "select-task", taskId: task.id });
      },
      updateTaskStatus(taskId, status) {
        const data = structuredClone(uiState.data);
        const task = data.tasks.find((item) => item.id === taskId);
        if (!task) return;
        task.status = status;
        syncThreadStatuses(data);
        dispatch({ type: "replace-data", data });
      },
      addPlanItem(taskId, stepText) {
        const data = structuredClone(uiState.data);
        const task = data.tasks.find((item) => item.id === taskId);
        if (!task) return;
        const orderIndex = data.plans.filter((plan) => plan.taskId === taskId).length + 1;
        data.plans.push(
          createPlanRecord({
            id: makeId("plan"),
            threadId: task.threadId,
            taskId,
            stepText,
            orderIndex,
          }),
        );
        dispatch({ type: "replace-data", data });
      },
      updatePlanStatus(planId, status) {
        const data = structuredClone(uiState.data);
        const plan = data.plans.find((item) => item.id === planId);
        if (!plan) return;
        plan.status = status;
        dispatch({ type: "replace-data", data });
      },
      createApproval(taskId, { title, reason }) {
        const data = structuredClone(uiState.data);
        const task = data.tasks.find((item) => item.id === taskId);
        if (!task) return;
        data.approvals.push(
          createApprovalRecord({
            id: makeId("approval"),
            threadId: task.threadId,
            taskId,
            title,
            reason,
          }),
        );
        dispatch({ type: "replace-data", data });
      },
      resolveApproval(approvalId, decision) {
        const data = structuredClone(uiState.data);
        const approval = data.approvals.find((item) => item.id === approvalId);
        if (!approval) return;
        approval.status = "resolved";
        approval.decision = decision;
        dispatch({ type: "replace-data", data });
      },
      async resetData() {
        localStorage.removeItem(STORAGE_KEY);
        const data = await fetch("/seed.json").then((res) => res.json());
        dispatch({ type: "bootstrap", data });
      },
    }),
    [uiState.data],
  );

  return {
    isLoading,
    derived,
    selection: uiState.selection,
    actions,
  };
}

function syncThreadStatuses(data) {
  data.threads.forEach((thread) => {
    const tasks = data.tasks.filter((task) => task.threadId === thread.id);
    thread.status = deriveThreadStatus(tasks);
  });
}
