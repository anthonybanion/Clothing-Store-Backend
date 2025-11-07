# Docker Setup

A modern clothing store application built with a microservices architecture using Docker containers. This project consists of a React frontend and Node.js backend with MongoDB database.

## 🏗️ Project Architecture

```

clothing_store/
├── docker-compose.yml
├── backend/                 # Node.js API Server
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/               # React Application
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── database/              # MongoDB initialization
    └── init.js
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker
- Docker Compose

## 🚀 Quick Start

1. Clone the Repositories

```bash
# Clone backend repository and rename folder to 'backend'
git clone https://github.com/anthonybanion/Clothing-Store-Backend.git backend

# Clone frontend repository and rename folder to 'frontend'
git clone https://github.com/anthonybanion/Clothing-Store-Frontend.git frontend
```

2. Get Docker Compose File

Download the docker-compose.yml file from the project repository and place it in the root directory alongside the backend and frontend folders. 3. Run the Application

```bash
# Start all services (backend, frontend, and database)
docker compose up

# Or run in detached mode (background)
docker compose up -d
```

4. Access the Application

Once all services are running, access the application at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: MongoDB running on localhost:27017

## 🛠️ Development Commands

### Starting Specific Services

```bash
# Start only backend and database (for API development)
docker compose up backend database

# Start only frontend (for UI development)
docker compose up frontend

# Start with rebuild (when dependencies change)
docker compose up --build
```

### Monitoring and Logs

```bash
# View logs for all services
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs frontend

# Follow logs in real-time
docker compose logs -f frontend
```

### Management Commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Check service status
docker compose ps

# Restart specific service
docker compose restart backend
```

## 🏗️ Service Details

### Backend Service

- Port: 5000
- Framework: Node.js with Express
- Database: MongoDB with Mongoose ODM
- Features: REST API, JWT Authentication, Product Management

### Frontend Service

- Port: 5173
- Framework: React with Vite
- Features: Modern UI, Responsive Design, Shopping Cart

### Database Service

- Database: MongoDB 4.4.18
- Port: 27017
- Authentication: Enabled with admin user

## 🔧 Environment Configuration

The application uses environment variables for configuration. Key variables include:

- MONGODB_URL: MongoDB connection string
- JWT_SECRET: JWT token secret key
- PORT: Server port (default: 5000)
