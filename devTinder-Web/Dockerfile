# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /app

# Accept the API URL as a build argument
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Copy package management files to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies strictly from package-lock.json
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Run the production build
RUN npm run build

# Stage 2: Serve the Static Assets with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
