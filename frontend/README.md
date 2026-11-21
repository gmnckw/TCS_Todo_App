# Todo App Frontend

React (Vite, JavaScript) single-page app for the Todo API defined in `../openapi.yaml`.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend. Defaults:

| Variable           | Default                  | Purpose                              |
| ------------------ | ------------------------ | ------------------------------------ |
| `FRONTEND_PORT`    | `5173`                   | Dev server port                      |
| `API_PROXY_TARGET` | `http://localhost:4000`  | Backend that `/api` requests go to   |

## Scripts

- `npm run dev` start the dev server
- `npm run build` production build to `dist/`
- `npm run preview` serve the production build
- `npm test` run Jest and React Testing Library tests
- `npm run lint` run ESLint

## Structure

```
src/
  config/       constants: roles, statuses, priorities, routes, storage keys
  services/     all Axios calls (apiClient unwraps the { success, data } envelope)
  context/      AuthContext: JWT and signed-in user
  hooks/        data hooks used by pages; components never call services directly
  components/   common UI (loading/empty/error states, badges, form fields), routing guards, task widgets
  layouts/      authenticated app shell
  pages/        login, tasks (list, detail, create/edit), reports
  utils/        validation, filters, permissions, formatting
```

## Behaviour

- **Auth.** The JWT and user are stored in `localStorage` under `todo-app.auth` and exposed through `AuthContext`. A `401` from the API signs the user out.
- **Routes.** `/login` is public. Everything else requires a session. `/reports` also requires the `MANAGER` role.
- **Permissions.** The UI hides edit and delete where the API would reject them: employees act only on their own, non-completed tasks. The server remains the authority.
- **States.** Every data view shows loading, empty, and error states. Every form validates input, shows server field errors, and reports success.
- **Assignee.** Managers enter a numeric user ID, because the API exposes no users endpoint.
