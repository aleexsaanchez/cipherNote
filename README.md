# CipherNotes

CipherNotes is a web application that allows users to create and manage personal notes.

## Frontend Setup
cd client
npm install
npm run dev

## Backend Setup
cd server
npm install
npm start

## Testing Guide

This project uses Jest for all tests:

- Unit tests for core backend logic
- Integration tests for API endpoints
- React Testing Library tests for important frontend interactions

### 1) Install dependencies

From the project root:

```bash
npm install --prefix server
npm install --prefix client
```

### 2) Run backend tests

```bash
npm test --prefix server
```

What is covered:

- `authMiddleware` unit tests:
	- Missing token returns `401`
	- Malformed or invalid token returns `401`
	- Valid token sets `req.userId` and calls `next`
- API integration tests:
	- Register success + duplicate user (`409`)
	- Login success + invalid login (`401`)
	- Protected route without token (`401`)
	- Notes CRUD flow (create, list, get by id, update, delete)
	- Missing note returns `404`

### 3) Run frontend tests

```bash
npm test --prefix client
```

What is covered:

- `AuthPage`:
	- Login submit flow
	- Register mode toggle and submit flow
	- Error message rendering when auth fails
- `Header`:
	- Logout visibility based on auth state
	- Logout action triggers callback and navigation
- `NotesListPage`:
	- Notes rendering and search filtering
	- Empty state rendering
	- Delete interaction

### 4) Run full suite

```bash
npm test
```

### Notes on current coverage

- Covered: critical auth, protected API behavior, note CRUD paths, and key UI interactions.
- Not covered yet:
	- Frontend API utility module (`client/src/api.js`) request error edge cases
	- Visual styling/CSS regression tests
	- End-to-end browser flows (for that, consider Playwright or Cypress)