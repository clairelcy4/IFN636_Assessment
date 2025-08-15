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

## How to run in local environment

1. `cd frontend` Navigate to "frontend" folder.
2. `npm install` Install dependencies
3. `npm start` Runs the app in the development mode.
   Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

4. `npm test` Launches the test runner in the interactive watch mode.

## How to run in AWS environment

1. Go to EC2 website and **Start instancel** of i-04f8c82f9368bb1ba (clairelin)
2. Push git changes to `main` branch.
3. Normally, the application is deployed automatically via GitHub Actions workflow (ci.yml).
4. If manual deployment is needed, run the following command:
   - Use terminal SSH into AWS EC2 instance.
   - `cd ~/www/frontend`
   - `yarn install`
   - `sudo rm -rf ./build`
   - `yarn run build`
   - `pm2 serve build/ 3000 --name "Frontend"--spa`
   - `pm2 status`
   - `pm2 save`
