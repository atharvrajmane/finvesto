const { UserModel } = require("../../models/UserModel");

class AuthRepository {
  // Finds a user by either username or email
  async findUserByUsernameOrEmail(username, email) {
    return UserModel.findOne({ $or: [{ username }, { email }] }).lean();
  }

  // Finds a user by username.
  async findUserByUsername(username) {
    return UserModel.findOne({ username });
  }

  // Creates a new user in the database
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
