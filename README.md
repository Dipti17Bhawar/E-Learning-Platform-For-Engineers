# 🎓 E-Learning Platform for Engineers

<p align="center">
  <strong>A MERN Stack Web Application for Engineering Students</strong>
  <br />
  Organize, access, and download educational resources by engineering branch and subject.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

---

## 📖 About the Project

**E-Learning Platform for Engineers** is a web-based educational platform developed using the MERN stack. It helps engineering students find and access study materials organized by branch and subject.

The application provides a structured way to manage educational resources, including notes, question papers, and study materials. It also includes user authentication and protected routes to support secure access to application features.

## ✨ Features

- 🔐 **User Authentication** — Registration and login functionality.
- 🛡️ **Protected Routes** — Restricts access to authorized pages.
- 🎓 **Branch-Wise Learning** — Organizes resources according to engineering branches.
- 📚 **Subject-Wise Resources** — Access learning materials for individual subjects.
- 📄 **Study Materials** — View and download available resources.
- 🛠️ **Resource Management** — Supports resource administration and uploads.
- 📱 **Responsive Interface** — Designed for convenient navigation across screen sizes.

## 🖥️ Screenshots

### 🏠 Home Page

<!-- Add your Home page screenshot here -->
<p align="center">
  <img src="screenshots/home.png" alt="E-Learning Platform Home Page" width="90%" />
</p>

### 📊 Dashboard

<!-- Add your Dashboard screenshot here -->
<p align="center">
  <img src="screenshots/dashboard.png" alt="E-Learning Platform Dashboard" width="90%" />
</p>

> **Note:** Add your actual screenshots to the `screenshots` folder and use the corresponding filenames above.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| Node.js | JavaScript runtime for the backend |
| Express.js | Backend API and routing |
| MongoDB | Database for application data |
| Mongoose | MongoDB object modeling |
| JWT | Token-based authentication |
| Axios | HTTP requests between frontend and backend |
| CSS | Styling and responsive layouts |
| Git & GitHub | Version control and source code management |

## 📁 Project Structure

```text
E-Learning-Platform-For-Engineers/
│
├── client/                         # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Layout/
│   │   │   ├── Navbar/
│   │   │   ├── ProtectedRoute/
│   │   │   ├── ResourceCard/
│   │   │   └── SubjectCard/
│   │   │
│   │   ├── context/                # Shared application state
│   │   ├── views/                  # Application pages
│   │   │   ├── About/
│   │   │   ├── Admin/
│   │   │   ├── BranchSubjects/
│   │   │   ├── Dashboard/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Resources/
│   │   │   └── Reviews/
│   │   │
│   │   ├── App.jsx                 # Main application and routes
│   │   ├── App.css                 # Application styles
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   │
│   └── package.json
│
├── server/                         # Node.js and Express backend
│   ├── config/
│   │   ├── db.js                   # Database connection
│   │   └── gridfs.js               # GridFS file storage setup
│   │
│   ├── controllers/                # Request handling and business logic
│   │   ├── authController.js
│   │   ├── branch.js
│   │   ├── resource.js
│   │   ├── subject.js
│   │   └── user.js
│   │
│   ├── middleware/                 # Authentication and file uploads
│   │   ├── auth.js
│   │   └── upload.js
│   │
│   ├── models/                     # MongoDB data models
│   │   ├── Branch.js
│   │   ├── Resource.js
│   │   ├── Subject.js
│   │   └── User.js
│   │
│   ├── routes/                     # Backend API routes
│   │   ├── authRoutes.js
│   │   ├── branchRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── subject.js
│   │   └── userRoutes.js
│   │
│   ├── uploads/                    # Local uploaded files, if used
│   ├── .env                        # Environment variables (not committed)
│   └── package.json
│
└── README.md
```

*The tree illustrates the main folders and files; adjust any filenames to match your actual project.*

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dipti17Bhawar/E-Learning-Platform-For-Engineers.git
cd E-Learning-Platform-For-Engineers
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal from the project root:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

Replace the example values with your actual configuration. Use the environment variable names expected by your backend code.

### 5. Run the Application

**Start the backend** in the `server` terminal:

```bash
npm run dev
```

**Start the frontend** in the `client` terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

> Check the `scripts` section in each `package.json`. If your backend does not define a `dev` script, use its configured start command instead.

## 🔄 Application Workflow

1. A user opens the web application.
2. The user registers or logs in.
3. The frontend sends API requests to the Express backend.
4. The backend validates requests and interacts with MongoDB.
5. The user selects an engineering branch and subject.
6. Available resources are displayed for viewing or downloading.
7. Authorized administrators can manage resources according to the implemented permissions.

## 🔒 Security

- Store secrets and database credentials in environment variables.
- Keep `.env` files out of version control.
- Protect private routes and verify authorization on the backend.
- Validate uploaded files and enforce suitable size and file-type restrictions.
- Use HTTPS and appropriate CORS settings in production.

## 🚀 Future Enhancements

- Advanced resource search and filtering.
- Student bookmarks and recently viewed resources.
- Improved administrator analytics.
- Additional learning and resource-management features.

## 👩‍💻 Developer

**Dipti Bhawar**

- GitHub: [@Dipti17Bhawar](https://github.com/Dipti17Bhawar)
- LinkedIn: [Dipti Bhawar](https://www.linkedin.com/in/dipti-bhawar-246780357/)

---

<p align="center">
  <strong>Built to make engineering learning resources easier to organize and access.</strong>
</p>