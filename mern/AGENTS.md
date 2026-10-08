# Rules for AI coding agents

This is a MERN project built from a feature-modular template. Follow these rules
exactly. When in doubt, copy how the `auth` feature does it.

## Commands (run from the repo root)

| Command               | Use                                       |
| --------------------- | ----------------------------------------- |
| `npm run install:all` | install root, backend and client          |
| `npm run dev`         | backend (:5000) + client (:5173) together |
| `npm test`            | backend tests (Vitest, in-memory MongoDB) |
| `npm run lint`        | ESLint, backend + client                  |
| `npm run format`      | Prettier, whole repo                      |
| `npm run build`       | client production build                   |

**Before saying a task is done**, run `npm run lint`, `npm test`, `npm run format`
and `npm run build`, and fix anything they report.

## Folder structure: one folder per feature in every layer

A "feature" is a module like `auth`, `dashboard`, `users`, `products`. Its code goes
in a folder named after it inside **each** layer. Never put feature code loose in a
layer folder, and never create new top-level folders.

```
backend/src/
  models/<name>.model.js                 Mongoose schema (models stay flat)
  validators/<feature>/<name>.schema.js  zod request-body schemas
  controllers/<feature>/<name>.controller.js
  routes/<feature>/<name>.routes.js      mounted in routes/index.js
  middleware/<feature>/                  feature-specific middleware
  utils/<feature>/                       feature-specific helpers
backend/tests/<feature>/<name>.test.js

client/src/
  pages/<feature>/XxxPage.jsx            one component per route
  components/<feature>/                  UI used by that feature
  components/common/                     UI shared by several features
  hooks/<feature>/useXxx.js              TanStack Query hooks, feature logic
  services/<feature>/<name>.service.js   API calls only
  validators/<feature>/<name>.schema.js  zod schemas for forms
  context/<feature>/                     only if the feature needs global state
```

Shared (not feature) code: `backend/src/config/`, `middleware/validate.js`,
`middleware/errorHandler.js`, `utils/ApiError.js`, `client/src/services/api.js`,
`client/src/lib/`.

## Adding a feature (e.g. `products`)

Backend:

1. `models/product.model.js`
2. `validators/products/product.schema.js`: `createProductSchema`, `updateProductSchema`
3. `controllers/products/product.controller.js`
4. `routes/products/product.routes.js`: `validate(schema)`, `protect`, `authorize(...)`
5. Register in `routes/index.js`: `router.use('/products', productRoutes)`
6. `tests/products/product.test.js`, using the helpers in `tests/helpers.js`

Client:

1. `services/products/product.service.js`, using `request()` from `services/api.js`
2. `hooks/products/useProducts.js`: `useQuery` / `useMutation` around the service
3. `components/products/…` and `pages/products/ProductsPage.jsx`
4. Lazy route in `App.jsx`, inside `<ProtectedRoute />` if it needs login

## Backend rules

- Express 5: async errors reach `errorHandler` automatically. **No try/catch in
  controllers**; `throw new ApiError(status, message)` for expected errors.
- Validate every request body with a zod schema via `validate(schema)` in the route.
  Controllers trust `req.body`; don't re-check fields by hand.
- Read config only from `src/config/env.js`. Never use `process.env` anywhere else.
  New env vars go in `env.js` **and** `backend/.env.example`.
- Responses: `{ success: true, data }` or `{ success: false, message }`.
- Auth: `protect` puts the user on `req.user`; `authorize('admin')` checks roles.
  Never return passwords (the model already strips them).
- The JWT lives only in the httpOnly `access_token` cookie. Never put it in a
  response body or anywhere JavaScript can read it.

## Client rules

- All HTTP goes through `request()` in `services/api.js`. Never call `fetch` or
  add axios in components. Never use localStorage/sessionStorage for auth.
- Server data: TanStack Query hooks in `hooks/<feature>/`, not `useEffect` + `useState`.
- Forms: react-hook-form + `zodResolver` with a schema from `validators/<feature>/`.
- Feedback: `toast` from `sonner`. Session state: `useAuth()`.
- Styling: Tailwind classes only. No CSS files per component, no inline style
  objects, no UI component libraries.
- Animation: GSAP via `useGSAP` with a `scope` ref, wrapped in
  `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.
- Components are arrow functions with a default export, one per file, PascalCase
  file names. Hooks start with `use`.

## Code style

- Prettier decides formatting (semicolons, single quotes, 100 columns). Don't fight it.
- Match the surrounding code: naming, comment density, file layout.
- Comments explain _why_, not what. No commented-out code, no leftover `console.log`.
- No dead code, unused imports or unused files. Delete what you replace.
- Keep functions small; extract a helper when logic repeats a third time.

## Don't

- Don't add a dependency without asking first. Prefer what's already installed.
- Don't edit `.env` files or commit secrets. Update `.env.example` instead.
- Don't change the folder structure, auth flow, or these rules without asking.
- Don't create docs/markdown files unless asked; update the existing READMEs instead.
