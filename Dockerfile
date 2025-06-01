# Stage 1: Build the Angular application
FROM node:lts-alpine as build

WORKDIR /app

# Copy application files
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY src ./src

# Install dependencies
RUN npm install

# Build the application
RUN npm run build -- --configuration production

# Use the official Nginx image to serve the Angular app

FROM nginx:1.28.0-alpine-slim

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/kitchensink-ui/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]