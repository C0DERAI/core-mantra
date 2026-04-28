---
name: cook-me
description: Use when the user wants to stress-test a plan or design before committing to it. Conducts relentless one-at-a-time Q&A, walking down each branch of the decision tree and resolving dependencies until full shared understanding is reached.
type: lifecycle
---

## Purpose

Stress-test a plan or design by interviewing the developer about every aspect until every decision branch is resolved and understood.

## Process

1. Ask the user to state the plan or design being examined (or confirm if already given).
2. Identify the top-level decision branches (architecture, data model, API surface, failure modes, etc.).
3. For each branch, ask one question at a time — working depth-first. Provide your recommended answer alongside each question.
4. If a question can be answered by exploring the codebase, explore it instead of asking.
5. Record each resolved decision as a one-line summary before moving to the next branch.
6. Continue until all branches are resolved and no open questions remain.
7. Produce a final summary of every decision made, grouped by branch.

## Hard rules

- Ask exactly one question at a time. Never stack multiple questions.
- Always provide your recommended answer with each question.
- Explore the codebase rather than asking if the answer is derivable from code.
- Never skip a branch because it seems obvious.
- Do not write code during this session — resolution only.
- In `lite` mode, collapse to the 3 highest-risk branches only.
