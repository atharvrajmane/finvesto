const { UserModel } = require("../../models/UserModel");

class UserRepository {
  async getUserById(userId, session = null) {
    return UserModel.findById(userId).session(session).lean();
  }

  async updateUserBalance(userId, amount, session = null) {
    return UserModel.findOneAndUpdate(
      { 
        _id: userId,
        $expr: { 
          $and: [
            { $gte: [{ $add: ["$balance", amount] }, 0] },
            { $lte: [{ $add: ["$balance", amount] }, 1000000] }
          ] 
        } 
      },
      { $inc: { balance: amount } },
      { new: true, session }
    ).lean();
  }
}

module.exports = new UserRepository();