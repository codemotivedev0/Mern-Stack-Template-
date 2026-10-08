# Backend (Express + MongoDB, MVC)

## Run

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Needs MongoDB. Either install it locally, or create a free Atlas
cluster and put its connection string in `.env` as `MONGO_URI`.
The server refuses to start if `MONGO_URI` or `JWT_SECRET` is missing.

Generate a JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Structure

Each feature gets its own folder inside every layer (`auth`, `dashboard`, `users`).

```
server.js                     entry point: connects DB, starts server
scripts/makeAdmin.js          promote a user to admin
src/
  app.js                      express app, middleware, route mounting
  config/env.js               reads + validates every env var
  config/db.js                MongoDB connection
  models/                     Mongoose schemas (the M)
  controllers/<feature>/      request handlers / business logic (the C)
  routes/<feature>/           URL -> controller mapping
  validators/<feature>/       zod schemas for request bodies
  middleware/auth/            protect (JWT), authorize (roles), rate limit
  middleware/                 validate(schema), notFound, central errorHandler
  utils/ApiError.js           throw new ApiError(404, 'message')
tests/<feature>/              Vitest + Supertest, in-memory MongoDB
```

The "V" is the React app in `../client`: this API only returns JSON.

## Endpoints

| Method | URL              | Access    | Action                     |
| ------ | ---------------- | --------- | -------------------------- |
| GET    | /                | public    | health check               |
| POST   | /api/auth/signup | public    | create account, set cookie |
| POST   | /api/auth/login  | public    | log in, set cookie         |
| POST   | /api/auth/logout | public    | clear cookie               |
| GET    | /api/auth/me     | logged in | current user + expiry      |
| GET    | /api/dashboard   | logged in | dashboard data             |
| GET    | /api/users       | admin     | list users                 |
| GET    | /api/users/:id   | admin     | get one                    |
| POST   | /api/users       | admin     | create                     |
| PUT    | /api/users/:id   | admin     | update name, email, role   |
| DELETE | /api/users/:id   | admin     | delete (not yourself)      |

Browsers authenticate with the httpOnly `access_token` cookie set on login.
Non-browser clients (mobile, Postman) can send `Authorization: Bearer <token>`
instead, using the token from that cookie.

## Roles

Signup always creates a `user`. To make the first admin:

```bash
npm run make-admin -- you@example.com
```

Guard a route with `router.use(protect, authorize('admin'))`.

## Security

- `helmet` security headers, JSON bodies capped at 100kb
- Login/signup rate limited: 10 failed attempts per 15 minutes per IP
- Every request body is validated with zod, which also blocks NoSQL injection
  like `{ "email": { "$gt": "" } }`
- Passwords hashed with bcrypt and never returned by the API
- JWT only in an httpOnly cookie (`SameSite=Lax`, `Secure` in production),
  so XSS can't steal it. Settings: `COOKIE_SAMESITE`, `COOKIE_SECURE`
- CSRF: cookie-authenticated `POST/PUT/PATCH/DELETE` requests must send an
  `X-Requested-With` header (`middleware/auth/csrf.js`)

## Tests

```bash
npm test             # run once
npm run test:watch   # re-run on change
```

Tests use an in-memory MongoDB (the first run downloads it), so your real
database is never touched. `tests/helpers.js` has `createUser({ role })` and
`authHeader(token)` for writing new ones.

## Adding a new feature (e.g. products)

1. `src/models/product.model.js` - define the schema
2. `src/validators/products/product.schema.js` - zod schemas for create/update
3. `src/controllers/products/product.controller.js` - write the handlers
4. `src/routes/products/product.routes.js` - map URLs to handlers with
   `validate(schema)` and `protect` / `authorize` as needed
5. `src/routes/index.js` - add `router.use('/products', productRoutes);`
6. `tests/products/product.test.js` - cover the routes
