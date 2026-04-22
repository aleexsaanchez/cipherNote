# CipherNote

CipherNote is a full-stack note-taking app for cybersecurity study notes. It lets users register, sign in, and manage structured notes with rich text formatting, tags, search, edit, and delete actions.

## Project Overview

The app is designed to keep lab findings, tactics, hardening steps, and reference material in one organized workspace. Notes support formatted content so users can store more than plain text and still browse entries quickly from the notes list.

## Technologies Used

- Frontend: React, Vite, React Router, TipTap
- Backend: Node.js, Express, Sequelize, SQLite, JWT, bcrypt
- Testing: Jest, React Testing Library, Supertest
- Deployment: Render for the API, Vercel for the frontend

## Live Deployment

- Frontend: https://cipher-note-nine.vercel.app
- Backend API: https://ciphernote-7z4s.onrender.com/api

## Local Setup

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

From the project root:

```bash
npm install --prefix server
npm install --prefix client
```

### Run the backend locally

```bash
cd server
npm start
```

### Run the frontend locally

```bash
cd client
npm run dev
```

### Environment variables

Backend on Render:

- `JWT_SECRET` - secret used to sign auth tokens
- `JWT_EXPIRES_IN` - token lifetime, for example `24h`
- `NODE_ENV` - `production`
- `NODE_VERSION` - `20`
- `CLIENT_ORIGIN` - your Vercel frontend URL
- `SQLITE_STORAGE` - `./database.sqlite` for the free-tier fallback used in this project

Frontend on Vercel:

- `VITE_API_BASE_URL` - full API base URL, for example `https://ciphernote-7z4s.onrender.com/api`

## API Endpoints

Base path: `/api`

### Auth

- `POST /users/register` - create a new user
- `POST /users/login` - log in and receive a JWT token

### Notes

All notes routes require a bearer token in the `Authorization` header.

- `GET /notes` - list the current user’s notes
- `GET /notes/:id` - get a single note by id
- `POST /notes` - create a new note
- `PUT /notes/:id` - update an existing note
- `DELETE /notes/:id` - delete a note

## Screenshots

The screenshots below are included in the repository and render inline:

### Auth Page

![Auth page](client/public/screenshots/auth-page.png)

### Notes List Empty State

![Notes list empty state](client/public/screenshots/notes-empty.png)

### Create Note Page

![Create note page](client/public/screenshots/create-note.png)

### Notes List With Saved Note

![Notes list with saved note](client/public/screenshots/notes-saved.png)

## Tests

Run the test suites from the project root:

```bash
npm test --prefix server
npm test --prefix client
```

The existing automated coverage includes backend auth and API behavior, plus frontend auth, notes list, and header interactions.

## Deployment Notes

- Render hosts the backend API.
- Vercel hosts the frontend.
- The frontend reads the backend URL from `VITE_API_BASE_URL`.
- The backend allows the frontend origin through `CLIENT_ORIGIN`.
- This project uses SQLite, so production storage depends on the Render runtime configuration used for this assignment.

## Manual Verification

Before submitting, verify the production flow end-to-end:

1. Open the Vercel frontend.
2. Register a new user.
3. Confirm the app loads notes immediately after registration.
4. Create a note and refresh the page.
5. Confirm the note still appears.
6. Log out and log back in.

## Notes on Coverage

- Covered: authentication, note CRUD, protected routes, notes list rendering, and the register auto-login flow.
- Not added yet: browser automation tests such as Playwright or Cypress.