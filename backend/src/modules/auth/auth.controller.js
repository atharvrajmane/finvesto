const authService = require("./auth.service");
const asyncWrapper = require("../../utils/asyncWrapper");
const { success } = require("../../utils/response");

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

exports.register = asyncWrapper(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setTokenCookies(res, accessToken, refreshToken);
  return success(res, { user }, "User registered successfully!", 201);
});

exports.login = asyncWrapper(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setTokenCookies(res, accessToken, refreshToken);
  return success(res, { user }, "Login successful", 200);
});

exports.refresh = asyncWrapper(async (req, res) => {
  const currentRefreshToken = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await authService.refresh(currentRefreshToken);
  setTokenCookies(res, accessToken, refreshToken);
  return success(res, null, "Tokens refreshed successfully", 200);
});

exports.logout = asyncWrapper(async (req, res) => {
  if (req.user && req.user._id) {
    await authService.logout(req.user._id);
  }
  
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  return success(res, null, "Logout successful", 200);
});

exports.me = asyncWrapper(async (req, res) => {
  // We just fetch the user's basic profile details
  const { UserModel } = require('../../models/UserModel');
  const AppError = require('../../utils/AppError');
  
  if (!req.user || !req.user._id) {
    throw new AppError("Unauthorized", 401);
  }
  
  const user = await UserModel.findById(req.user._id).select('username email balance');
  
  if (!user) {
    throw new AppError("User not found", 404);
  }
  
  return success(res, { user: { id: user._id, username: user.username, email: user.email, balance: user.balance } }, "User verified", 200);
});
