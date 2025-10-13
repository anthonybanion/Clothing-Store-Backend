# Clothing-Store-Backend
Backend for Ecommerce Clothing Store built with Node.js, Express, and MongoDB.  Implements user authentication with JWT, full CRUD operations for users, products, and purchases, and RESTful API endpoints.

## Folder Structure

```text
clothingstore-backend/
│
├─ src/
│   ├─ config/               # Configuration files (DB connection, env)
│   │   └─ db.js
│   │
│   ├─ models/               # Mongoose models
│   │   ├─ user.model.js
│   │   ├─ product.model.js
│   │   ├─ category.model.js
│   │   ├─ order.model.js
│   │   └─ orderDetails.model.js
│   │
│   ├─ routes/               # Express routes / controllers
│   │   ├─ auth.routes.js
│   │   ├─ user.routes.js
│   │   ├─ product.routes.js
│   │   ├─ category.routes.js
│   │   ├─ order.routes.js
│   │   └─ orderDetails.routes.js
│   │
│   ├─ controllers/          # Controllers handle the logic
│   │   ├─ auth.controller.js
│   │   ├─ user.controller.js
│   │   ├─ product.controller.js
│   │   ├─ category.controller.js
│   │   ├─ order.controller.js
│   │   └─ orderDetails.controller.js
│   │
│   ├─ services/             # Business logic / database queries
│   │   ├─ auth.service.js
│   │   ├─ user.service.js
│   │   ├─ product.service.js
│   │   ├─ category.service.js
│   │   ├─ order.service.js
│   │   └─ orderDetails.service.js
│   │
│   ├─ middlewares/          # Auth, error handling, logging, etc.
│   │   ├─ auth.middleware.js
│   │   ├─ error.middleware.js
│   │   └─ logger.middleware.js
│   │
│   ├─ utils/                # Utility functions
│   │   ├─ validators.js
│   │   ├─ hash.js
│   │   └─ jwt.js
│   │
│   ├─ tests/                # Unit / integration tests
│   │   ├─ user.test.js
│   │   ├─ product.test.js
│   │   └─ order.test.js
│   │
│   ├─ app.js                # Express app setup
│   └─ server.js             # Entry point, server listen
│
├─ .env                      # Environment variables
├─ .gitignore
├─ package.json
└─ README.md

```