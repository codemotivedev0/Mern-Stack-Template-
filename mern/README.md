# MERN Template

Express + MongoDB API (`backend/`) and React + Vite + Tailwind + GSAP client (`client/`),
with JWT auth (signup, login, protected routes, roles) and a dashboard.

## Quick start

```bash
npm run install:all                         # installs root, backend and client
cp backend/.env.example backend/.env        # fill in MONGO_URI and JWT_SECRET
cp client/.env.example client/.env
npm run dev                                 # API on :5000, client on :5173
```

In development the client calls `/api/...` and Vite proxies it to the backend,
so no CORS setup is needed locally.

## Scripts (run from the root)

| Script                          | What it does                                   |
| ------------------------------- | ---------------------------------------------- |
| `npm run dev`                   | backend + client together                      |
| `npm run dev:backend`           | backend only (nodemon)                         |
| `npm run dev:client`            | client only (Vite)                             |
| `npm run build`                 | production build of the client                 |
| `npm start`                     | start the backend without nodemon              |
| `npm test`                      | backend tests (in-memory MongoDB, never yours) |
| `npm run lint`                  | ESLint on backend and client                   |
| `npm run format`                | format everything with Prettier                |
| `npm run make-admin -- <email>` | promote a user to admin                        |

## Stack

| Area    | Libraries                                                               |
| ------- | ----------------------------------------------------------------------- |
| API     | Express 5, Mongoose, bcryptjs, jsonwebtoken, zod, helmet, rate limiting |
| Client  | React 19, React Router, TanStack Query, react-hook-form + zod, sonner   |
| UI      | Tailwind CSS v4, GSAP                                                   |
| Quality | Vitest + Supertest, ESLint, Prettier                                    |

## Conventions

Code is split by feature: every layer gets a folder per feature (`auth`, `dashboard`, `users`).

```
backend/src/
  controllers/<feature>/   routes/<feature>/   validators/<feature>/   middleware/<feature>/
backend/tests/<feature>/

client/src/
  pages/<feature>/         components/<feature>/   hooks/<feature>/
  services/<feature>/      validators/<feature>/   context/<feature>/
  components/common/       shared UI (loader, ...)
  services/api.js          fetch wrapper: base URL, JWT header, errors
  lib/queryClient.js       TanStack Query defaults
```

### Adding a feature (e.g. products)

Backend: see [backend/README.md](backend/README.md#adding-a-new-feature-eg-products).

Client:

1. `services/products/product.service.js` - API calls using `request()` from `services/api.js`
2. `hooks/products/useProducts.js` - `useQuery` / `useMutation` around the service
3. `components/products/` and `pages/products/ProductsPage.jsx` - the UI
4. `App.jsx` - add a lazy route, inside `<ProtectedRoute />` if it needs login

## Auth flow

The JWT is stored in an **httpOnly cookie**, so page JavaScript (and any
injected script) can never read it.

1. Signup/login: the API sets the `access_token` cookie (`HttpOnly`, `SameSite=Lax`,
   `Secure` in production). The token is never in the response body.
2. `services/api.js` sends `credentials: 'include'`, so the browser attaches the cookie.
3. On page load `AuthProvider` asks `GET /api/auth/me` whether the session is valid.
4. Logout calls `POST /api/auth/logout`, which clears the cookie.
5. Any 401 on a protected request logs the user out with a toast.
6. Logging in or out in one tab updates every open tab (BroadcastChannel).

CSRF: state-changing requests must send `X-Requested-With`, which other sites
can't add without passing CORS. `services/api.js` does this for you.

## Production notes

- Build the client with `VITE_API_URL` set to the deployed API, e.g. `https://api.example.com/api`.
- Set `CLIENT_URL` on the backend to the deployed client URL (CORS).
- Serve the API over HTTPS; the cookie is `Secure` when `NODE_ENV=production`.
- Easiest: client and API on the same site (`app.example.com` + `api.example.com`,
  or one domain with `/api` proxied), which works with the default `COOKIE_SAMESITE=lax`.
  Only if they are on different sites, set `COOKIE_SAMESITE=none`.
- Set `TRUST_PROXY=1` when the backend runs behind a reverse proxy.
