# Workflow

## Core Interaction Model

Sam Chat is designed around a structured coordination flow:

1. Conversation happens inside a thread
2. A message may become a task
3. A task may receive a plan
4. A task may require approval
5. Status is updated as the work changes
6. The thread summary reflects the current state

## Thread Types

### Top-level thread

Used for:
- coordination
- intake
- prioritization
- routing

### Work thread

Used for:
- focused execution
- detailed task progress
- local approvals and blockers

## Task Flow

1. Select a message
2. Create a task manually from that message
3. Set the initial status
4. Add plan items as needed
5. Update status over time
6. Close the task when done

## Approval Flow

1. Create an approval item from the selected task
2. Mark the decision as `yes` or `no`
3. Reflect the outcome in the task state

Approval scope is limited to the task level in MVP.

## Status Flow

Supported statuses:
- `todo`
- `in_progress`
- `blocked`
- `done`

## MVP Workflow Goal

The goal is not automation. The goal is to prove that structured coordination can emerge from a chat-first interface without domain coupling.
