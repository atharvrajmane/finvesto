const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const WatchListSchema=new Schema({
    name: String,
    price: Number,
    percent: String,
    isDown: Boolean,
});

module.exports=mongoose.model("watchlist",WatchListSchema);