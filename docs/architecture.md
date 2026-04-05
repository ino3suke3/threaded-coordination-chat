# Architecture

## Overview

Sam Chat PoC is a React web application served by Vite in local development. It uses local JSON seed data for initialization and browser localStorage for persistence across reloads.

## Components

### UI Layer

- Thread list
- Thread detail and message timeline
- Composer
- Task creation panel
- Task list and task detail panel
- Plan panel
- Approval panel
- Status summary panel

### State Layer

The app uses a client-side reducer and a small state module under `src/state/`. The state model contains:
- threads
- messages
- tasks
- plan items
- approval items
- UI selection state

### Data Initialization

- `public/seed.json` provides initial threads, messages, tasks, plans, and approvals
- localStorage overrides seed data after the first write
- reset returns the app to the seed baseline

### Local Dev Server

- Vite serves the React application
- no backend service is required

## Main Data Model

### Thread

- `id`
- `title`
- `kind`: `top_level` or `workstream`
- `status`
- `summary`
- `ownerRole`
- `messageIds`
- `taskIds`

### Message

- `id`
- `threadId`
- `senderType`
- `body`
- `createdAt`

### Task

- `id`
- `threadId`
- `sourceMessageId`
- `title`
- `description`
- `status`
- `priority`
- `owner`
- `needsApproval`
- `planIds`
- `approvalIds`

### PlanItem

- `id`
- `threadId`
- `taskId`
- `stepText`
- `status`
- `orderIndex`

### ApprovalItem

- `id`
- `threadId`
- `taskId`
- `title`
- `reason`
- `status`
- `decision`

Approvals exist only at task level in MVP.

## Architectural Boundaries

- No authentication layer in MVP
- No backend persistence in MVP
- No real-time sync in MVP
- No domain-specific orchestration layer in MVP
- No VPS integration in MVP
- No multi-user coordination in MVP

## Extension Path

This structure is designed so future versions can add:
- backend storage
- GitHub synchronization
- agent execution adapters
- user identity and permissions
- VPS-hosted runtime coordination
