const mongoose = require("mongoose");

module.exports = mongoose.model("Book", new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    review: { type: String, required: true },
    genre: { type: String, required: true },
    stars: { type: Number, required: true },
    wishingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}));