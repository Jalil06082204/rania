# Security Specification — Her Little Heart (Private Production Edition)

## 1. Access Control Model & Roles
- **Unauthenticated Visitors (`request.auth == null`)**:
  - Zero access to any collection (`allow read, write: if false;`).
  - Cannot read or list love letters, voice recordings, memories, user profiles, study topics, flashcards, quiz questions, ECG notes, or journal entries.
- **Role 1: `owner` (Application Owner)**:
  - Bootstrapped via primary email (`ajmedset2004@gmail.com`) or designated in `/config/access` (`ownerUid` / `ownerEmail`) or `/users/{uid}.role == 'owner'`.
  - Can read and write `/config/access` to authorize Rania's email/UID.
  - Can create, update, and delete shared romantic collections:
    - `/letters/{letterId}`
    - `/voiceRecordings/{recId}`
    - `/memories/{memoryId}`
  - Owns their own private `/users/{uid}/*` subcollections when testing the study/journal features.
- **Role 2: `rania` (Authorized Recipient)**:
  - Authorized via `/config/access` (`raniaEmail` or `raniaUid`) or `/users/{uid}.role == 'rania'`.
  - Can read `/letters/{letterId}`, `/voiceRecordings/{recId}`, and `/memories/{memoryId}` (cannot create, overwrite, or delete Owner-managed romantic gifts unless also granted Owner privileges).
  - Has full read/write ownership over her private subcollections under `/users/{userId}/*` where `request.auth.uid == userId`:
    - `settings/preferences`
    - `studyTopics/{topicId}`
    - `flashcards/{cardId}`
    - `quizQuestions/{quizId}`
    - `ecgNotes/{noteId}`
    - `journalEntries/{entryId}`
- **Unauthorized Authenticated Users**:
  - Any authenticated account not matching the authorized `owner` or `rania` identity is denied access to both shared romantic content and private subcollections.

## 2. Data Invariants
1. **Strict Field Whitelisting**: Every document write (`create` and `update`) enforces `request.resource.data.keys().hasOnly(...)` and `hasAll(...)`.
2. **Ownership Immutability**:
   - Private subcollections under `/users/{userId}/*` require `request.resource.data.uid == userId` and `request.auth.uid == userId`. On update, `request.resource.data.uid == resource.data.uid`.
   - Shared romantic documents (`/letters`, `/voiceRecordings`, `/memories`) require `request.resource.data.authorUid == request.auth.uid` on create and `request.resource.data.authorUid == resource.data.authorUid` on update.
3. **Bounded String & Media Sizes**:
   - Titles, labels, and dates are bounded (`1..300` chars).
   - Long-form notes, letters, and journal entries are bounded (`<= 20000` chars).
   - Embedded base64 media (`audioDataUrl`, `imageUrl`) are bounded (`<= 950000` chars) to prevent 1 MiB BSON exhaustion while supporting private Firestore-protected media without public URLs.
4. **Role Escalation Prevention**:
   - A non-owner user cannot set `role: 'owner'` in `/users/{userId}` or modify `/config/access`.

## 3. Adversarial "Dirty Dozen" Payloads Tested
1. Unauthenticated read on `/letters/ow-1` -> **DENIED**
2. Unauthenticated read on `/users/rania-uid/journalEntries/je-1` -> **DENIED**
3. Unauthenticated read on `/memories/mem-1` -> **DENIED**
4. Unauthorized third-party authenticated user reading `/letters/ow-1` -> **DENIED**
5. Rania attempting to delete or overwrite `/letters/ow-1` -> **DENIED**
6. Rania attempting to escalate `/users/rania-uid` to `role: 'owner'` -> **DENIED**
7. User A attempting to read User B's `/users/user-b/journalEntries/je-1` -> **DENIED**
8. User A attempting to create a study topic with `uid: 'user-b'` -> **DENIED**
9. Injecting undeclared field `isAdmin: true` into `/users/{uid}/studyTopics/{id}` -> **DENIED**
10. Oversized string payload (`title.size() > 300`) in `/users/{uid}/studyTopics/{id}` -> **DENIED**
11. Out-of-range Pomodoro duration (`focusMinutes: 9999` or `-5`) in `/users/{uid}/settings/preferences` -> **DENIED**
12. Invalid priority enum (`priority: 'UrgentHack'`) in `/users/{uid}/studyTopics/{id}` -> **DENIED**
