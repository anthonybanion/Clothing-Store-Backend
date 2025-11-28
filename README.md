# Clothing Store - Backend API

A robust and scalable RESTful API backend for an e-commerce clothing store, built with Node.js, Express, and MongoDB. This API provides complete CRUD operations for products and categories, user authentication, and secure file uploads.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%2520web%2520tokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- Live Demo
- Features
- Technologies
- API Documentation
- Database Documentation
- Installation & Setup
- Admin Access
- Project Structure
- Environment Variables
- Development
- Deployment
- License

## 🌐 Live Demo

**API Base URL:** https://clothing-store-backend-flax.vercel.app

## ✨ Features

- JWT Authentication - Secure user authentication system
- Product Management - Complete CRUD operations for products
- Category Management - Full category management system
- File Upload - Image handling with validation
- Input Validation - Comprehensive request validation
- API Documentation - Interactive Swagger UI
- Pagination - Efficient data retrieval
- Error Handling - Robust error management

## 🛠 Technologies

- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt
- Validation: Express Validator
- File Handling: Multer, Sharp
- Documentation: Swagger UI
- Logging: Winston

## 📚 API Documentation

Full interactive API documentation with Swagger UI:

**Production:** https://clothing-store-backend-flax.vercel.app/api/docs/

**Local Development:** http://localhost:5000/api/docs/

The Swagger documentation includes:

- Complete endpoint specifications
- Request/response schemas
- Authentication requirements
- Interactive testing interface
- Error code documentation

## 📊 Database Documentation

For complete database documentation including schemas, relationships, and validations, check the:

[Data Dictionary](docs/dictionary/README.md)

The dictionary includes:

    Complete table structure and relationships

    Data validations and constraints

    Database schemas

    Implemented business rules

## 🚀 Installation & Setup

### Prerequisites

- Node.js (version 16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

## Step-by-Step Installation

1. Clone the repository

```bash

git clone https://github.com/anthonybanion/Clothing-Store-Backend.git
cd Clothing-Store-Backend
```

2. Install dependencies

```bash

npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory:

```bash

# Server Configuration
PORT=5000
NODE_ENV=development
APP_NAME=Clothing-Store

# Database Configuration
URLDB=your_mongodb_connection_string_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

4. Start the development server

```bash

npm run dev
```

5. Verify the installation

- API should be running on http://localhost:5000
- Access Swagger docs at http://localhost:5000/api/docs/
- You should see: "Clothing Store API is running on port 5000"

## 🔑 Admin Access

For testing protected endpoints and admin functionalities, use these default credentials:

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

This admin account has full permissions to:

- Create, read, update, and delete products
- Manage categories
- Access all protected endpoints

## 📁 Project Structure

```text

clothingstore-backend/
│
├─ src/
│   ├─ config/               # Configuration files
│   │   ├─ database.js       # MongoDB connection
│   │   └─ logger.js         # Winston logger setup
│   │
│   ├─ models/               # MongoDB models
│   │   ├─ User.js          # User model
│   │   ├─ Product.js       # Product model
│   │   └─ Category.js      # Category model
│   │
│   ├─ routes/               # Express routes
│   │   ├─ auth.js          # Authentication routes
│   │   ├─ products.js      # Product routes
│   │   └─ categories.js    # Category routes
│   │
│   ├─ controllers/          # Business logic
│   │   ├─ authController.js
│   │   ├─ productController.js
│   │   └─ categoryController.js
│   │
│   ├─ middlewares/          # Custom middlewares
│   │   ├─ auth.js          # Authentication middleware
│   │   ├─ errorHandler.js  # Error handling
│   │   └─ validation.js    # Request validation
│   │
│   └─ index.js              # Application entry point
│
├─ .env                      # Environment variables
├─ package.json
└─ README.md
```

## ⚙️ Environment Variables

| Variable       | Description               | Required | Default               |
| -------------- | ------------------------- | -------- | --------------------- |
| PORT           | Server port number        | Yes      | 5000                  |
| URLDB          | MongoDB connection string | Yes      | -                     |
| FRONTEND_URL   | Frontend URL for CORS     | Yes      | http://localhost:3000 |
| JWT_SECRET     | Secret key for JWT tokens | Yes      | -                     |
| JWT_EXPIRES_IN | JWT token expiration      | No       | 15m                   |
| NODE_ENV       | Environment mode          | No       | development           |

## 🛠 Development

Start development server with hot reload:

```bash

npm run dev
```

Run in production mode:

```bash

npm start
```

Run tests:

```bash

npm test
```

Run tests with coverage:

```bash

npm test -- --coverage
```

## 🚀 Deployment

The application is deployed on Vercel and automatically updates from the main branch.

**Production URL:** https://clothing-store-backend-flax.vercel.app

### Deployment Steps:

1. Connect your GitHub repository to Vercel
2. Configure all environment variables in Vercel dashboard
3. Deployments happen automatically on push to main branch

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
