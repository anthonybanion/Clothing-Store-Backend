FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the rest of the application
COPY . .

EXPOSE 5000

# Use npm run dev for development with auto-reload
CMD ["npm", "run", "dev"]