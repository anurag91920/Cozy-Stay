const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    checkin: {
      type: Date,
      required: true
    },
    checkout: {
      type: Date,
      required: true
    },
    guests: {
      type: Number,
      required: true,
      min: 1
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
