import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Branch from "./models/Branch.js";
import Resource from "./models/Resource.js";

dotenv.config();
await connectDB();

const branches = [
  {
    name: "Computer Engineering",
    code: "CE",
    description: "Programming, databases, web development and computer systems.",
    subjects: [
      { name: "Data Structures", code: "DS" },
      { name: "Database Management System", code: "DBMS" },
      { name: "Web Technology", code: "WT" },
      { name: "Operating System", code: "OS" }
    ]
  },
  {
    name: "Information Technology",
    code: "IT",
    description: "Software engineering, networks, databases and information systems.",
    subjects: [
      { name: "Software Engineering", code: "SE" },
      { name: "Computer Networks", code: "CN" },
      { name: "DBMS", code: "DBMS" },
      { name: "Web Development", code: "WD" }
    ]
  },
  {
    name: "Electronics and Telecommunication",
    code: "ENTC",
    description: "Electronics, communication, embedded systems and signals.",
    subjects: [
      { name: "Digital Electronics", code: "DE" },
      { name: "Microcontrollers", code: "MC" },
      { name: "Signals and Systems", code: "SS" },
      { name: "Communication Systems", code: "CS" }
    ]
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
    description: "Core mechanical engineering subjects and design.",
    subjects: [
      { name: "Thermodynamics", code: "TD" },
      { name: "Fluid Mechanics", code: "FM" },
      { name: "Machine Design", code: "MD" },
      { name: "Manufacturing Processes", code: "MP" }
    ]
  }
];

await Branch.deleteMany({});
await Branch.insertMany(branches);

const studentPassword = await bcrypt.hash("Student@123", 12);
const adminPassword = await bcrypt.hash("Admin@123", 12);

await User.findOneAndUpdate(
  { email: "student@example.com" },
  {
    name: "Demo Student",
    email: "student@example.com",
    password: studentPassword,
    role: "student",
    branch: "CE"
  },
  { upsert: true, new: true }
);

await User.findOneAndUpdate(
  { email: "admin@example.com" },
  {
    name: "Demo Admin",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin"
  },
  { upsert: true, new: true }
);

await Resource.deleteMany({});

await Resource.insertMany([
  {
    title: "Data Structures - Unit 1 Notes",
    description: "Introduction to arrays, linked lists and stacks.",
    branch: "CE",
    subject: "Data Structures",
    type: "notes",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  },
  {
    title: "Data Structures Video",
    description: "Video lecture resource.",
    branch: "CE",
    subject: "Data Structures",
    type: "videos",
    url: "https://www.youtube.com/watch?v=RBSGKlAvoiM"
  },
  {
    title: "DBMS Previous Year Questions",
    description: "Practice questions for DBMS.",
    branch: "CE",
    subject: "Database Management System",
    type: "qps",
    url: "https://www.mongodb.com/docs/"
  }
]);

console.log("Seed completed.");
console.log("Student: student@example.com / Student@123");
console.log("Admin: admin@example.com / Admin@123");
process.exit(0);
