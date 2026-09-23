const { UserModel } = require("../../models/UserModel");

class AuthRepository {
  async findUserByUsernameOrEmail(username, email) {
    return UserModel.findOne({ $or: [{ username }, { email }] }).lean();
  }

  async findUserByUsername(username) {
    return UserModel.findOne({ username });
  }

  async createUser(userData) {
    const user = new UserModel(userData);
    return user.save();
  }
  async updateUserRefreshToken(userId, refreshToken) {
    return UserModel.findByIdAndUpdate(userId, { refreshToken }, { new: true });
  }

  async findUserById(userId) {
    return UserModel.findById(userId);
  }
}

module.exports = new AuthRepository();
