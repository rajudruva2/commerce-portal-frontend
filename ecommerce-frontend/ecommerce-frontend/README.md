# ecommerce-frontend

React + Vite frontend for the Ecommerce end-to-end project.

## Requirements

- Node.js 20+
- npm
- ecommerce-backend running on localhost:8080

## Run

```bash
npm install
npm run dev
```

Open:

http://localhost:5173

## Connection

The frontend calls:

```text
http://localhost:8080/api
```

The Spring Boot backend connects to the PostgreSQL database from the separate `ecommerce-database` repository.

## Flow

```text
React/Vite :5173
      |
      v
Spring Boot :8080
      |
      v
PostgreSQL :5432
```
