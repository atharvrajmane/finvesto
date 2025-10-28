const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  stockName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

watchlistSchema.index({ userId: 1, stockName: 1 }, { unique: true });

const WatchlistModel = mongoose.model("Watchlist", watchlistSchema);

module.exports = { WatchlistModel };
