# 🎮 Gaming Shop

Gaming Shop is a full-stack cloud-native e-commerce web application for gaming products.

The application allows users to browse products, manage shopping carts, place orders, and manage their accounts, while administrators can manage products and users through a dedicated dashboard.

The application is deployed entirely on AWS using modern cloud services with an automated CI/CD pipeline.

---

# Features

## User Features

- User registration and login
- JWT authentication
- Browse gaming products
- Product search and filtering
- Shopping cart management
- Update cart quantities
- Remove products from cart
- Place orders
- View order history
- Responsive interface

---

## Admin Features

- Secure admin dashboard
- Create products
- Update products
- Delete products
- View all users
- Create user accounts
- Edit user information
- Activate/deactivate accounts
- Grant or revoke administrator permissions
- Delete users

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React Icons

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Docker

## Database

- PostgreSQL
- Amazon RDS

## Cloud & DevOps

- AWS Amplify
- Amazon ECS Express
- Amazon ECR
- GitHub Actions
- IAM OIDC Authentication

---

# AWS Architecture

```text
                      GitHub
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
 GitHub Actions                  AWS Amplify
 (Backend CI/CD)              (Frontend Hosting)
          │                             │
          ▼                             ▼
   Build Docker Image             React Frontend
          │
          ▼
     Amazon ECR
          │
          ▼
 Amazon ECS Express
          │
          ▼
 Amazon RDS PostgreSQL
```

---

# Deployment

## Frontend

The frontend is deployed using **AWS Amplify**.

Amplify is connected directly to the GitHub repository and automatically builds and deploys the application whenever changes are pushed to the configured branch.

---

## Backend

The backend is containerized using Docker.

Deployment flow:

1. Build Docker image
2. Push image to Amazon ECR
3. Register a new ECS Task Definition revision
4. Deploy the new revision to Amazon ECS Express

The backend is exposed through Amazon ECS Express and communicates securely with the PostgreSQL database hosted on Amazon RDS.

---

## Database

The application uses **Amazon RDS PostgreSQL**.

Characteristics:

- Managed PostgreSQL database
- Not publicly accessible
- Hosted inside the application's VPC
- Accessible only from the backend service

---

# CI/CD

Continuous deployment is implemented using **GitHub Actions**.

Every push to the `main` branch automatically:

```text
Push to GitHub
        │
        ▼
GitHub Actions
        │
        ▼
Build Docker Image
        │
        ▼
Push Image to Amazon ECR
        │
        ▼
Create new ECS Task Definition
        │
        ▼
Deploy new ECS Revision
```

The frontend deployment is handled independently by AWS Amplify.

---

# Authentication

The backend uses **JWT Authentication**.

Features include:

- Secure login
- Password hashing
- Token validation
- Role-based authorization
- Administrator permissions

---

# Project Structure

```text
Online_Shop/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       └── backend-deploy.yml
│
├── compose.yaml
│
└── README.md
```

---

# Security

- JWT Authentication
- Password hashing
- Role-based authorization
- IAM OIDC authentication for GitHub Actions
- Amazon RDS configured as **not publicly accessible**
- AWS IAM roles instead of long-lived AWS credentials

---

# Future Improvements

- AWS Secrets Manager
- Infrastructure as Code using Terraform
- CloudWatch dashboards
- Monitoring and alerting
- Unit and integration tests
- Product search
- Payment integration
- Email notifications

---

# Author

**Nicola-Diana Sincaru**