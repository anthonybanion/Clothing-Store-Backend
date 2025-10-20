# Clothing-Store-Backend
Backend for Ecommerce Clothing Store built with Node.js, Express, and MongoDB.  Implements user authentication with JWT, full CRUD operations for users, products, and purchases, and RESTful API endpoints.

## Folder Structure

```text
clothingstore-backend/
│
├─ src/
│   ├─ config/               # Configuration files (DB connection, env)
│   │
│   ├─ models/               # Mongoose models
│   │
│   ├─ routes/               # Express routes / controllers
│   │
│   ├─ controllers/          # Controllers handle the logic
│   │
│   ├─ services/             # Business logic / database queries
│   │
│   ├─ middlewares/          # Auth, error handling, logging, etc.
│   │
│   ├─ utils/                # Utility functions
│   │
│   ├─ tests/                # Unit / integration tests
│   │
│   ├─ app.js                # Express app setup
│   └─ server.js             # Entry point, server listen
│
├─ .env                      # Environment variables
├─ .gitignore
├─ package.json
└─ README.md

```