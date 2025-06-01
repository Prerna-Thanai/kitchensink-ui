# 🌐 KitchenSink Frontend (Angular)

An Angular application that provides a user interface for the KitchenSink backend. It includes user registration, login with JWT, and displays secure data via REST APIs.

## ⚙️ Tech Stack

- Angular 19.2.13
- JWT Authentication
- REST API integration with Spring Boot backend

## 📁 Project Structure

src/
├── app/
│ ├── core/ # Core modules (auth, interceptors, guards)
│ ├── shared/ # Shared components, directives, pipes
│ ├── services/ # Services (API, Auth, etc.)
│ ├── models/ # TypeScript interfaces & models
│ ├── components/ # UI components (buttons, forms, etc.)
│ ├── pages/ # Page-level components (Login, Register, Dashboard)
│ └── app-routing.module.ts# Route definitions
│
├── assets/ # Static assets (images, icons)
├── environments/ # Dev/prod environment configs
└── index.html # Entry point

🚀 Running Locally
Requirements
Node.js v18+
Angular CLI 19.2.13

Steps
# Install Angular CLI if not installed
npm install -g @angular/cli@19.2.13

# Install dependencies
npm install

# Run locally
ng serve
or npm start

# Run the application with docker
docker-compose up --build

Visit the app at: http://localhost:4200

☁️ Deployment on Azure
Application is connected to Github Actions and auto deployment is enabled using CI-CD