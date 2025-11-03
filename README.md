<h1 align="center">🗳️ Online Voting App</h1>

<p align="center">
  <b>A secure, efficient and user-friendly online voting platform.</b><br/>
  Built with <code>Node.js</code>, <code>Express</code>, <code>MongoDB</code>, and <code>EJS</code>.
</p>

---

## 🚀 Overview
This project enables users to register, log in, and cast votes securely — while admins manage candidates and monitor live results in real time.  
Perfect for learning **authentication**, **session management**, and **CRUD operations** in backend development.

---

## 🌐 Live Demo
🔗 [**View Deployment**](#) *((https://voting-app-dob7.onrender.com/))*  

---

## 🖥️ Features
| Category | Description |
|-----------|-------------|
| 👤 **Authentication** | Signup & Login with sessions |
| 🧑‍💼 **Role-Based Access** | Admin & Voter privileges |
| 🧾 **Candidate Management** | Add, Edit, Delete (Admin only) |
| 🔒 **Security** | Bcrypt password hashing & sessions |
| 🗳️ **Voting System** | One vote per user logic |
| ⚙️ **RESTful APIs** | Organized Express routes |
| 🎨 **Frontend** | Clean EJS templates + CSS |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| 🧠 **Backend** | Node.js, Express.js |
| 🎨 **Frontend** | EJS, HTML, CSS |
| 🗄️ **Database** | MongoDB |
| 🔑 **Auth** | express-session |
| ☁️ **Deployment** | Render / Railway |

---

## ⚙️ Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/VKantB05/voting-app-backend-ejs.git

# 2️⃣ Navigate to folder
cd voting-app-backend-ejs

# 3️⃣ Install dependencies
npm install

# 4️⃣ Setup your .env file
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

# 5️⃣ Start the server
npm start
