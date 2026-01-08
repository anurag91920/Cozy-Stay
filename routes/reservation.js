const express = require("express");
const router = express.Router({ mergeParams: true });
const Reservation = require("../models/reservation");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// ===================
// My Reservations (FIRST)
// ===================
router.get("/my", isLoggedIn, async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("reservations/my", { reservations });
});

// ===================
// Reservation Form
// ===================
router.get("/:id/reserve", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("reservations/new", { listing });
});

// ===================
// Handle Reservation POST
// ===================
router.post("/:id/reserve", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin, checkout, guests, email, mobile } = req.body;

    if (!checkin || !checkout || !guests || !email || !mobile) {
      req.flash("error", "All fields are required!");
      return res.redirect(`/listings/${id}/reserve`);
    }

    if (new Date(checkin) >= new Date(checkout)) {
      req.flash("error", "Checkout date must be after check-in date!");
      return res.redirect(`/listings/${id}/reserve`);
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const reservation = new Reservation({
      listing: id,
      user: req.user._id,
      checkin,
      checkout,
      guests,
      email,
      mobile
    });

    await reservation.save();

    req.flash("success", "Reservation confirmed!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while reserving!");
    res.redirect("/listings");
  }
});

module.exports = router;
