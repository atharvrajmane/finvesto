const authRepository = require("./auth.repository");
const AppError = require("../../utils/AppError");
const jwt = require("jsonwebtoken");

class AuthService {
  _generateTokens(userId) {
    const accessToken = jwt.sign({ sub: userId, type: 'access' }, process.env.JWT_SECRET, {
      expiresIn: "15m", 
    });

    const refreshToken = jwt.sign({ sub: userId, type: 'refresh' }, process.env.JWT_SECRET, {
      expiresIn: "7d", 
    });

    return { accessToken, refreshToken };
  }

  async register({ username, email, password }) {
    const existingUser = await authRepository.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new AppError("Username or email already exists.", 400);
    }

    const newUser = await authRepository.createUser({ username, email, password });

    const { accessToken, refreshToken } = this._generateTokens(newUser._id);
    await authRepository.updateUserRefreshToken(newUser._id, refreshToken);

    return {
      user: { id: newUser._id, username: newUser.username },
      accessToken,
      refreshToken
    };
  }

  async login({ username, password }) {
    const user = await authRepository.findUserByUsername(username);

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Authentication failed. Invalid credentials.", 401);
    }

    const { accessToken, refreshToken } = this._generateTokens(user._id);
    await authRepository.updateUserRefreshToken(user._id, refreshToken);

    return {
      user: { id: user._id, username: user.username },
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401);
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

            if (decoded.type !== 'refresh') {
         throw new AppError("Invalid token type", 401);
      }

      const user = await authRepository.findUserById(decoded.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      const tokens = this._generateTokens(user._id);
      await authRepository.updateUserRefreshToken(user._id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }

  async logout(userId) {
    await authRepository.updateUserRefreshToken(userId, null);
    return { success: true };
  }
}

module.exports = new AuthService();
