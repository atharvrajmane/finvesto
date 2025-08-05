const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const OrderSchema=new Schema({
    name: String,
    qty: Number,
    price: Number,
    model:String,
});

module.exports=mongoose.model("order",OrderSchema);