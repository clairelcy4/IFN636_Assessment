# IFN636 Assessment 1 – Frontend

This is the **React.js** frontend for "Pet Clinic Management System" for IFN636 Assessment 1.  
It connects to the backend API (Node.js + Express + MongoDB) deployed on AWS EC2.

## Frontend Key Features:

- User authentication (login, register)[Done]
- Pet profile management [Done]
- Appointment scheduling [Done]
- Treatment record management [Done]
- Staff profile management [In Progress]

## Backend API Connection Configuration

- **/frontend/axiosConfig.js** Frontend API base URL configuration
- **/backend/controllers** Handle request logic (CRUD)
- **/backend/authMiddleware** Verify JWT tokens for protected routes
- **/backend/middleware** Error handling, logging...
- **/backend/models** MongoDB schema
- **/backend/routes** API links

---

## How to Run in Local Environment
1. `cd frontend` – Navigate to the **frontend** folder  
2. `npm install` – Install dependencies  
3. `npm start` – Start development server  
   - Runs at [http://localhost:3001](http://localhost:3001)  
4. `npm test` – Launch the interactive test runner  

---

## How to Run in AWS Environment

### Automatic Deployment (Default)
1. Go to AWS EC2 console and **Start instance**: `i-04f8c82f9368bb1ba` (clairelin)  
2. Push changes to the `main` branch  
3. Deployment will run automatically via GitHub Actions workflow (`ci.yml`)

### Manual Deployment (Fallback)
If CI/CD deployment fails or manual deployment is required:

```bash
# SSH into AWS EC2 instance
cd ~/www/frontend

# Install dependencies
yarn install

# Remove old build files
sudo rm -rf ./build

# Build production files
yarn run build

# Serve with PM2
pm2 serve build/ 3000 --name "Frontend" --spa

# Check and save PM2 process list
pm2 status
pm2 save
