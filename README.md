# Booking Platform API

A REST API built with **NestJS** and **PostgreSQL** that allows users to manage services and customer bookings, with JWT-based authentication.

## Project Overview

This platform exposes three groups of functionality:

- **Authentication** — user registration and login, issuing JWT access tokens.
- **Service Management** — authenticated users (e.g. staff/admins) can create, update, delete, and list services.
- **Booking Management** — customers can create bookings without authentication; managing bookings (listing, viewing, updating status, cancelling) requires authentication.

Business rules enforced by the API:

- A booking must reference an existing service.
- Booking dates cannot be in the past.
- A cancelled booking cannot be marked as completed.
- Only authenticated users can manage services.
- Customers can create bookings without authentication.

## Tech Stack

- NestJS (TypeScript)
- SQLite + TypeORM (file-based database — no separate DB server required)
- JWT authentication (`@nestjs/jwt`, `passport-jwt`)
- class-validator / class-transformer for request validation
- Swagger (`@nestjs/swagger`) for API documentation

## Installation Steps

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd booking-platform
   npm install
   ```

2. Copy the environment file and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

## Environment Variables

| Variable         | Description                     | Example              |
|------------------|----------------------------------|-----------------------|
| `PORT`           | Port the API listens on         | `3000`                |
| `DB_NAME`        | SQLite database file path       | `database.sqlite`      |
| `JWT_SECRET`     | Secret used to sign JWT tokens  | `change_this_secret`    |
| `JWT_EXPIRES_IN` | JWT token expiry duration       | `1d`                     |

All of these are listed in `.env.example`.

## Database Setup

No separate database server is required — this project uses **SQLite**, a file-based database. The database file (named by `DB_NAME` in `.env`, default `database.sqlite`) is created automatically in the project root the first time migrations are run.

The application uses `synchronize: false`, so the schema is created exclusively through migrations (see below) — this keeps schema changes explicit and reviewable.

## Running the Application

```bash
# development (watch mode)
npm run start:dev

# production build + run
npm run build
node dist/src/main.js
```

The API will be available at `http://localhost:3000`.

## Running Migrations

Migration files live in `src/migrations` and are generated/run against the `data-source.ts` configuration.

```bash
# generate a new migration after changing entities
npm run migration:generate -- src/migrations/MigrationName

# apply all pending migrations
npm run migration:run

# revert the last migration
npm run migration:revert
```

The initial migration (`InitSchema`) creates the `users`, `services`, and `bookings` tables, including the `bookings_status_enum` type and the foreign key from `bookings.serviceId` to `services.id`.

## API Documentation

Interactive Swagger documentation is available once the app is running:

```
http://localhost:3000/api/docs
```

It documents all endpoints, request/response schemas, and lets you authenticate with a Bearer token to try out protected routes directly from the browser.

### Endpoint summary

**Auth**
| Method | Endpoint         | Auth required |
|--------|------------------|---------------|
| POST   | `/auth/register` | No            |
| POST   | `/auth/login`    | No            |

**Services**
| Method | Endpoint         | Auth required |
|--------|------------------|---------------|
| POST   | `/services`      | Yes           |
| GET    | `/services`      | Yes           |
| GET    | `/services/:id`  | Yes           |
| PATCH  | `/services/:id`  | Yes           |
| DELETE | `/services/:id`  | Yes           |

**Bookings**
| Method | Endpoint               | Auth required |
|--------|-------------------------|---------------|
| POST   | `/bookings`             | No            |
| GET    | `/bookings`             | Yes           |
| GET    | `/bookings/:id`         | Yes           |
| PATCH  | `/bookings/:id/status`  | Yes           |
| PATCH  | `/bookings/:id/cancel`  | Yes           |

## Assumptions Made

- Only `POST /bookings` (creating a booking) is public, as explicitly stated in the requirements. All other booking-management endpoints (listing, viewing, updating status, cancelling) were assumed to require authentication, consistent with the rule that only authenticated users manage services and bookings represent business operations tied to a service.
- `User` registration/login only requires `email` and `password`; no role-based distinction (e.g. admin vs staff) was implemented since it wasn't specified.
- `bookingTime` is validated as a `HH:mm` string rather than a full timestamp, since the model separates `bookingDate` and `bookingTime`.
- Cancelling a booking (`PATCH /bookings/:id/cancel`) simply sets its status to `CANCELLED`; it does not delete the record.
- SQLite was chosen as the database for ease of setup (no separate DB server to install/run); the `Booking.status` enum is stored using TypeORM's `simple-enum` type with a `CHECK` constraint, since SQLite has no native enum type — the application-level behavior (validated `BookingStatus` values) is identical to a native enum.
- `synchronize` is disabled in favor of explicit TypeORM migrations, since the assignment explicitly requires migration files.

## Future Improvements

- Add pagination, search, and status filtering on the bookings list endpoint.
- Add a refresh token flow to complement the current access-token-only JWT setup.
- Add unit and e2e tests for services, bookings, and auth flows.
- Add role-based access control (e.g. distinguishing staff/admin accounts).
- Prevent duplicate bookings for the same service, date, and time slot.
- Add Docker/Docker Compose support for one-command local setup.
- Add a global exception filter for consistent error response shapes across the API.
