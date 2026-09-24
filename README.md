# E-Learning Platform for Engineers — MERN

Features:
- React + Vite client
- Express + MongoDB server
- JWT authentication
- Student registration/login/logout
- Protected dashboard
- Branch selection
- Branch → Subject → Notes / Videos / QPs / Materials
- View resources and download uploaded files
- Admin-only resource upload/delete
- Separate JSX and CSS files for components/views

## Folder structure

```text
E-Learning-Platform-For-Engineers/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Footer/
│   │   │   ├── Layout/
│   │   │   ├── Navbar/
│   │   │   ├── ProtectedRoute/
│   │   │   └── ResourceCard/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── views/
│   │   │   ├── About/
│   │   │   ├── Admin/
│   │   │   ├── BranchSubjects/
│   │   │   ├── Dashboard/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── NotFound/
│   │   │   ├── Register/
│   │   │   ├── Reviews/
│   │   │   └── Subject/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── config/db.js
    ├── controllers/
    ├── middleware/authMiddleware.js
    ├── models/
    ├── routes/
    ├── uploads/.gitkeep
    ├── .env.example
    ├── index.js
    ├── package.json
    └── seed.js
```

## Run locally

### Terminal 1 — server
```powershell
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

### Terminal 2 — client
```powershell
cd client
npm install
copy .env.example .env
npm run dev
```

Open:
`http://localhost:5173`

### Demo accounts

Student:
```text
student@example.com
Student@123
```

Admin:
```text
admin@example.com
Admin@123
```

## MongoDB

Local:
```env
MONGO_URI=mongodb://127.0.0.1:27017/e_learning
```

Atlas:
```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/e_learning
```

## Render deployment

Server:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Client:
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Client environment:
```env
VITE_API_URL=https://YOUR-SERVER.onrender.com/api
```

Server environment:
```env
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
CLIENT_URL=https://YOUR-CLIENT.onrender.com
```

Do not manually create `dist`; `npm run build` creates it.

## File uploads

This starter stores uploads in `server/uploads`. That is suitable for local development. On hosting platforms with ephemeral filesystems, use persistent object storage such as S3/Cloudinary for production files.
