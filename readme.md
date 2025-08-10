# Test_School Competency Assessment Platform

## Overview

This project is a multi-stage digital competency assessment platform designed to evaluate users' digital skills across different proficiency levels (A1 → C2). The system provides a 3-step progressive quiz, automated certification, and secure user authentication.

---

## Features Implemented

- Multi-step assessment with 3 progressive quiz stages  
- Timer per question with auto-submit on timeout  
- Question pool categorized by competency and level  
- User authentication with JWT (access & refresh tokens)  
- OTP verification via email  
- Secure password hashing (bcrypt)  
- Admin and student user roles  
- Basic UI with React and Tailwind CSS  
- Backend with Node.js, Express, MongoDB (Mongoose)  
- State management using Redux and RTK Query  

---

## Future Enhancements (Planned)

The following features are planned but not yet implemented in this submission:

- Admin dashboard for user, reports, and analytics management  
- Advanced test analytics per competency  
- Automated email notifications for test results and certifications  
- Mobile-optimized, fully responsive UI  
- Integration with Safe Exam Browser (SEB) for a secure exam environment  
- Live video recording during exams  

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- npm or yarn  
- MongoDB instance (Atlas or local)  

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Installation
Clone the repository and install dependencies for both backend and frontend:

git clone [https://github.com/sumaya257/Test-School-Assessment-Backend.git]
cd Test-School-Assessment-Backend
npm install
npm start

Database Seeding
1. Seed Questions
To insert the initial question pool into the database, run: npx node seed.js

2. Create Admin User
To create the first admin user, run:




