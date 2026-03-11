import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many registration attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many password reset attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many OTP verification attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many password reset attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
