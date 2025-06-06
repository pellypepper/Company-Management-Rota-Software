# Step 1: Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Step 2: Backend server
FROM node:18

WORKDIR /app

# Copy backend code and root package.json
COPY backend ./backend
COPY package*.json ./
COPY server.js ./
RUN npm install

# Copy frontend build to a public directory
COPY --from=frontend /app/frontend/build ./public
COPY database ./database

# Dockerfile
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL


# Set PORT and expose
ENV PORT=10000
EXPOSE 10000

# For debugging - list directory contents
CMD ["sh", "-c", "ls -la && echo 'Current directory:' && pwd && node server.js"]