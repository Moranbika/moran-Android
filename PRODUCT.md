# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

Existing React 19 + TypeScript + Vite application, shared by HarmonyOS phone, tablet and 2in1; Node.js + SQLite private admin service. The user delegated technical and design choices.

## Users

- Learner: uses 莫兰 on HarmonyOS to review vocabulary, practise listening and exams, and keep local study records.
- Content operator: the app owner, who is not a programmer and needs to update learning content through visible forms, previews and publish controls rather than edit source files.

## Product Purpose

莫兰 helps learners build general English vocabulary through a calm, local-first study experience. The content service lets the owner publish vocabulary corrections and new learning material without shipping a new app build.

## Positioning

An offline-first study app paired with a small, self-hosted content desk: the app always keeps a usable local content snapshot, while published content can update remotely when an HTTPS service is configured.

## Operating Context

- The owner signs into a browser admin page on desktop.
- Content is saved as a draft, previewed, then published as a numbered version.
- Learners receive the latest published version on the next app launch.
- Network or server failure must leave the previous cached or bundled content usable.

## Capabilities and Constraints

- Manage vocabulary books, their units and words.
- Manage core vocabulary entries.
- Manage listening sets, sections, questions and answers.
- Manage exam sets, passages, questions, writing and translation prompts.
- Save a draft, publish a version, restore an earlier version and export a backup.
- Preserve public-store privacy: no content request when no HTTPS API base is configured.
- Keep the existing `cet6-practice:` storage prefix and HarmonyOS bundle identity.
- Version numbers fixed at app `0.2.9`, Harmony `1.0.0` / code `1` unless the user changes them.

## Brand Commitments

- Product name: 莫兰.
- Existing quiet green, freshwater-glass visual identity.
- Chinese-first, plain-language controls for a non-programmer operator.
- No AI generation or external model calls in the current review cycle.

## Evidence on Hand

- Existing structured learning content in `src/data/books.ts`, `words.ts`, `listening.ts` and `practice.ts`.
- Existing private Node admin service and SQLite database in `server/`.
- HarmonyOS screenshots and release artifacts in `release/platforms/harmony/`.

## Product Principles

1. Publishing content must never strand learners without usable material.
2. The owner edits familiar content fields, not database rows or source code.
3. Drafting and publishing are separate, reversible actions.
4. Admin safety protects both learner data and the public app experience.
5. Operational density serves the task; the admin inherits the app's identity without decorative excess.

## Accessibility & Inclusion

The admin must work with keyboard navigation, visible focus, labelled form fields, readable contrast and responsive desktop/tablet widths.
