
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import User from "../models/User.js";

// CREATE JWT TOKEN
function createToken(id) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from server configuration.");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// RETURN PUBLIC USER INFORMATION
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branch: user.branch || null,
  };
}

// REGISTER
export async function register(req, res) {
  try {
    const { name, email, password, branch } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      branch: branch || null,
      role: "student",
    });

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).populate("branch", "name code");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
}

// GET CURRENT USER
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("branch", "name code");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
    });
  }
}

// FORGOT PASSWORD
export async function forgotPassword(req, res) {
  let user;

  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Avoid revealing whether an account exists.
    const successMessage =
      "If an account exists for this email, password reset instructions will be sent.";

    user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    const clientUrl = process.env.CLIENT_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const mailFrom = process.env.MAIL_FROM;

    if (!clientUrl || !resendApiKey || !mailFrom) {
      throw new Error(
        "CLIENT_URL, RESEND_API_KEY, or MAIL_FROM is missing."
      );
    }

    // Generate a secure, single-use reset token.
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the hash of the token in the database.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    const resetUrl =
      `${clientUrl.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(resetToken)}`;

    // Send the email using Resend's HTTPS API.
    const resend = new Resend(resendApiKey);

    const { data, error: emailError } =
      await resend.emails.send({
        from: mailFrom,
        to: [user.email],
        subject: "Reset your E-Learning Platform password",
        text: [
          `Hello ${user.name},`,
          "",
          "We received a request to reset your password.",
          "",
          `Open this link to reset your password: ${resetUrl}`,
          "",
          "This link expires in 15 minutes and can only be used once.",
          "If you did not request this, you can ignore this email.",
        ].join("\n"),
      });

    if (emailError) {
      throw new Error(emailError.message);
    }

    console.log("Password reset email accepted:", data?.id);

    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    // Clear the token if sending fails so the user can safely retry.
    if (user) {
      try {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      } catch (saveError) {
        console.error(
          "Unable to clear reset token:",
          saveError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to send the reset email. Please try again later.",
    });
  }
}

// RESET PASSWORD
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (
      typeof token !== "string" ||
      !token ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "The reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    // Invalidate the token after a successful password reset.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset your password. Please try again.",
    });
  }
}
