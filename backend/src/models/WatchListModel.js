const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
      index: true,
    },
  },
  { 
    timestamps: true 
  }
);

watchlistSchema.index({ userId: 1, stockId: 1 }, { unique: true });

const WatchlistModel = mongoose.model("Watchlist", watchlistSchema);

module.exports = { WatchlistModel };
