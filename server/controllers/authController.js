import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch || ""
  };
}

export async function register(req, res) {
  const { name, email, password, branch = "" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must contain at least 6 characters" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    branch
  });

  res.status(201).json({
    token: createToken(user._id),
    user: publicUser(user)
  });
}

export async function login(req, res) {
  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password || "";

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: createToken(user._id),
    user: publicUser(user)
  });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function updateProfile(req, res) {
  const { branch } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { branch: branch || "" },
    { new: true }
  );

  res.json({ user: publicUser(user) });
}
