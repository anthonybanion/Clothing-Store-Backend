# Clothing-Store-Backend

Backend for Ecommerce Clothing Store built with Node.js, Express, and MongoDB. Implements user authentication with JWT, full CRUD operations for users, products, and purchases, and RESTful API endpoints.

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

---

## Validation Responsibilities

Express-validator does:

- ✅ Basic format validation (email, URL)-
- ✅ Sanitization (trim, lowercase, normalizeEmail)-
- ✅ Required fields-
- ✅ MongoDB ID validation
- ✅ Campos requeridos

Mongoose does (your current model):

- ✅ Complex validations (custom regex)-
- ✅ Uniqueness (unique fields)-
- ✅ Specific lengths (minlength, maxlength)-
- ✅ Detailed error messages-
- ✅ Custom validations (HTTPS requirement, etc.)

## Docker

```
cd clothing_store
docker-compose up backend database

# Resultado:
# ✅ Backend en http://localhost:5000
# ✅ MongoDB en localhost:27017
# ❌ Frontend NO corre

cd clothing_store
docker-compose up frontend

# Resultado:
# ❌ Backend NO corre
# ❌ MongoDB NO corre
# ✅ Frontend en http://localhost:3000
# (El frontend usa REACT_APP_API_URL para conectar al backend)

cd clothing_store
docker-compose up

# o específicamente:
docker-compose up backend database frontend

# Resultado:
# ✅ Backend en http://localhost:5000
# ✅ MongoDB en localhost:27017
# ✅ Frontend en http://localhost:3000

# Ver qué servicios están corriendo
docker-compose ps

# Parar solo frontend
docker-compose stop frontend

# Parar solo backend + database
docker-compose stop backend database

# Parar todo
docker-compose down

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend

# Reconstruir y levantar
docker-compose up --build

cd clothing_store
docker-compose up backend database
# Editás código en backend/ con tu editor favorito
# Los cambios se reflejan automáticamente gracias al volumen


cd clothing_store
docker-compose up frontend
# Editás código en frontend/ con tu editor
# React hace hot-reload automáticamente


cd clothing_store
docker-compose up
# Probás que frontend y backend se comuniquen correctamente
```
