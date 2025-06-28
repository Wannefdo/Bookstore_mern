### 📘 **Bookstore MERN App**

A full-stack Bookstore web application built using the **MERN stack** (MongoDB, Express, React, Node.js). Users can sign up, log in, place orders, and manage their profiles.

---

### 🚀 Features

* 🔐 User Authentication (JWT)
* 📚 Book browsing (coming soon)
* 🛒 Order placement
* 👤 User profile management
* 🌐 RESTful API with MongoDB Atlas
* 🔧 Backend secured via environment variables

---

### 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Authentication:** JWT
* **Dev Tools:** Nodemon, dotenv, gh-pages

---

### 📂 Project Structure

```
Bookstore_mern/
├── client/           # React frontend
├── server/           # Express backend
│   ├── routes/       # Auth, User, Order APIs
│   ├── models/       # Mongoose schemas
│   └── server.js     # App entry point
└── .env              # Environment variables (not pushed to GitHub)
```

---

### ⚙️ Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/Wannefdo/bookstore_mern.git
```

2. **Backend Setup:**

```bash
cd server
npm install
# Create a .env file with:
# PORT=3000
# MONGODB_URI=your_mongo_uri
# JWT_SECRET=your_jwt_secret
npm run dev
```

3. **Frontend Setup:**

```bash
cd client
npm install
npm run dev
```

---

### 📦 Deployment

* Frontend deployed with `gh-pages`
* Ensure `.env` is excluded using `.gitignore`

---

