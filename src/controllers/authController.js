import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  }

  const token = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

  const templatePath = path.join(process.cwd(), 'src', 'templates', 'reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    username: user.username,
    resetLink,
  });

  try {
    await sendEmail(user.email, 'Password Reset', html);
  } catch {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Invalid or expired token');
  }

  const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

  if (!user) {
    throw createError(404, 'User not found');
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  res.status(200).json({
    message: 'Password reset successfully',
  });
};