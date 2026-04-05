# Scope

## Purpose

This document defines the scope of the Sam Chat generic PoC.

## In Scope

- A React-based web coordination prototype
- Support for top-level Sam threads and lower-level work threads
- Chat timeline display
- Manual task creation from selected messages
- Task status management
- Simple plan item tracking
- Simple yes/no approval tracking at task level
- Thread-level status summary
- Local seed data and browser-local persistence

## Out of Scope

- Authentication
- Multi-user synchronization
- VPS runtime control
- Real agent orchestration
- GitHub API integration
- Product-specific logic
- Deployment pipeline design
- Production-grade storage

## Design Constraints

- Domain-free only
- Single-user MVP only
- No product-specific workflow or vocabulary
- GitHub remains the future source of truth
- Local execution is enough for MVP
- localStorage is the only persistence mechanism in MVP

## MVP Success Test

The PoC succeeds if a user can:
- open the app locally
- browse threads
- send a message
- create a task from a message
- update the task state
- add plan items
- create or resolve approvals
- understand the current state of a thread from one screen
