import createError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;

  if (!accessToken || !sessionId) {
    throw createError(401, 'Missing access token or session');
  }

  const session = await Session.findOne({ _id: sessionId, accessToken });
  if (!session) {
    throw createError(401, 'Session not found');
  }

  if (new Date() > session.accessTokenValidUntil) {
    throw createError(401, 'Access token expired');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw createError(401, 'User not found');
  }

  req.user = user;
  next();
};