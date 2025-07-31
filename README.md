# FREELANCO – Freelancing Web Platform

FREELANCO is a full-stack role-based freelancing platform that connects companies with freelancers. It allows companies to evaluate freelancers based on custom tests, assign projects, and track progress through milestone-based payouts.

## 🚀 Features

### 👤 Role-Based Access
- Secure login & signup for **Freelancers** and **Companies**
- Authentication secured using hashed passwords via `bcrypt`

### 📄 Freelancer Functionality
- Resume upload
- 100-mark evaluation system:
  - Aptitude Test
  - Coding Test
- Test score ranking system

### 🏢 Company Functionality
- Dashboard to view and **rank freelancers**
- Project assignment interface
- Set milestones and payout structure
- Track project progress and freelancer status

### 🔒 Security
- Password hashing using `bcrypt`
- Basic input validations and protected routes

---

## 💻 Tech Stack

| Frontend       | Backend       | Database | Other Tools  |
|----------------|---------------|----------|--------------|
| React.js       | Node.js       | MongoDB  | bcrypt, Express.js |
| HTML/CSS/JS    | Express.js    | Mongoose | GitHub       |

---

## 📁 Folder Structure

freelanco/
├── client/ # Frontend (React)
│ └── ...
├── server/ # Backend (Node/Express)
│ └── ...
├── README.md # Project documentation
└── package.json

