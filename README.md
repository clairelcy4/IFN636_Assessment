<img width="468" height="50" alt="image" src="https://github.com/user-attachments/assets/7475a4f0-7c7d-4be9-8c68-ddb9fa4d4f1e" />**IFN636 Assessment 1**

Student name: Claire Lin\
Project name: **31-Pet Clinic Management System**\
Assignment: **Software requirements analysis and design (**Full-Stack CRUD Application Development with DevOps Practices**)**

---

**Objective**
This is the frontend for the IFN636 Assessment 1.
Framework: React.js
Backend API: Node.js + Express + MongoDB (Deployed on AWS EC2)

- **Project Management with JIRA**
- **Requirement Diagram**, **Block Definition Diagram (**BDD), Parametric Diagram using**SysML**
- **Version Control using GitHub**
- **CI/CD Integration for Automated Deployment**

---

**Access**
1. [GitHub](https://github.com/clairelcy4/IFN636_Assessment)
2. Jira: Refer to the report uploaded on Canvas
3. Public IP: Refer to the report uploaded on Canvas
4. Test account: Register a new one on the website

---

**Development Requirement**

1. Prerequisites
  - Node.js v22+
  - npm
  - MongoDB
  - AWS EC2 instance (QUT account)

2. Local environmnet setup
  - backend
    ```bash
    cd backend
    cp .env.example .env  # Add MONGO_URI, JWT_SECRET, PORT
    npm install
    npm run dev
    ```
  - frontend
    ```bash
    cd frontend
    npm install
    npm start
    ```
3. EC2 environmnet setup - CI/CD workflow
   The CI/CD pipeline is implemented in .github/workflows/ci.yml and runs automatically on push to the main branch.
   - Continuous Integration (CI)
     - Trigger: push event on main branch
     - Runner: Self-hosted AWS EC2 runner
     - Steps:
       - Checkout code
       - Setup Node.js v22
       - Install backend dependencies (yarn install)
       - Install frontend dependencies (yarn install)
       - Build frontend for production
       - Run backend tests (npm test)
   - Continuous Deployment (CD)
     - Stop existing PM2 processes (pm2 stop all)
     - Create .env in backend from GitHub Secrets
     - Restart backend via PM2 (pm2 start all)
     - Serve frontend build via PM2 (pm2 serve build/ 3000 --spa)
     - Nginx reverse proxy forwards HTTP (port 80) to frontend
