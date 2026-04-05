import React from "react";
import { ThreadList } from "../components/ThreadList";
import { ThreadView } from "../components/ThreadView";
import { StatusSnapshot } from "../components/StatusSnapshot";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";
import { TaskDetail } from "../components/TaskDetail";
import { useSamChatState } from "../state/useSamChatState";

export function App() {
  const state = useSamChatState();

  if (state.isLoading) {
    return <div className="loading-screen">Loading Sam Chat PoC...</div>;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="eyebrow">Generic PoC</p>
          <h1>Sam Chat</h1>
          <p className="muted">React-based coordination prototype</p>
        </div>

        <div className="sidebar-actions">
          <button className="secondary" onClick={state.actions.resetData}>
            Reset data
          </button>
        </div>

        <section className="panel">
          <div className="panel-head">
            <h2>Threads</h2>
          </div>
          <ThreadList
            threads={state.derived.threads}
            selectedThreadId={state.selection.threadId}
            onSelectThread={state.actions.selectThread}
          />
        </section>
      </aside>

      <main className="main-grid">
        <section className="chat-pane panel">
          <ThreadView
            thread={state.derived.selectedThread}
            messages={state.derived.selectedThreadMessages}
            selectedMessageId={state.selection.messageId}
            onSelectMessage={state.actions.selectMessage}
            onSubmitMessage={state.actions.createMessage}
          />
        </section>

        <aside className="detail-pane">
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Status</p>
                <h2>Snapshot</h2>
              </div>
            </div>
            <StatusSnapshot snapshot={state.derived.selectedThreadSnapshot} />
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Selection</p>
                <h2>Message to task</h2>
              </div>
            </div>
            <TaskComposer
              selectedMessage={state.derived.selectedMessage}
              onCreateTask={state.actions.createTaskFromMessage}
            />
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Tasks</p>
                <h2>Current thread</h2>
              </div>
            </div>
            <TaskList
              tasks={state.derived.selectedThreadTasks}
              selectedTaskId={state.selection.taskId}
              onSelectTask={state.actions.selectTask}
              onUpdateStatus={state.actions.updateTaskStatus}
            />
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Task detail</p>
                <h2>{state.derived.selectedTask?.title ?? "No task selected"}</h2>
              </div>
            </div>
            <TaskDetail
              task={state.derived.selectedTask}
              plans={state.derived.selectedTaskPlans}
              approvals={state.derived.selectedTaskApprovals}
              onAddPlan={state.actions.addPlanItem}
              onUpdatePlanStatus={state.actions.updatePlanStatus}
              onCreateApproval={state.actions.createApproval}
              onResolveApproval={state.actions.resolveApproval}
            />
          </section>
        </aside>
      </main>
    </div>
  );
}
