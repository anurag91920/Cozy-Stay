const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchrma = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchrma.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchrma);