const express = require("express");
const router = express.Router({ mergeParams: true });
const Reservation = require("../models/reservation");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Reservation form show
router.get("/:id/reserve", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("reservations/new", { listing });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

// Reservation save
router.post("/:id/reserve", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin, checkout, guests } = req.body;

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
      guests
    });

    await reservation.save();
    req.flash("success", "Reservation confirmed!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("back");
  }
});

module.exports = router;
