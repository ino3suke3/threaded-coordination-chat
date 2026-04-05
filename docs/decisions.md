# Decisions

## Initial Decisions

### D-001: Domain-free only

The PoC must remain generic and must not include product-specific logic.

### D-002: Local-first MVP

The MVP uses a React frontend, local seed JSON, and browser localStorage. No backend or authentication is required.

### D-003: Manual task creation

Messages do not automatically become tasks. A user explicitly creates a task from a selected message.

### D-004: Simple approvals

Approvals are limited to `yes` and `no` at the task level in MVP.

### D-005: Simple status model

Task status is limited to:
- `todo`
- `in_progress`
- `blocked`
- `done`

### D-006: Two thread classes

The MVP supports both top-level Sam threads and lower-level work threads.

### D-007: GitHub remains the source of truth

Replit AI or any prototype lane may assist development, but GitHub remains the source of truth for tracked evolution.

### D-008: Single-user PoC

The MVP assumes a single local user and does not model concurrent edits or shared sessions.
