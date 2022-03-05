const router = require("express").Router();

const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require the Room model in order to interact with the database
const Room = require("../models/Room.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { post } = require(".");

router.route("/:id/details").get((req, res) => {
  Room.findById(req.params.id)
    .populate("owner")
    .then((room) => {
      let roomOwner = false;
      if (req.session.user && room.owner._id == req.session.user._id) {
        roomOwner = true;
        res.render("rooms/room-details", { room, roomOwner });
      }
      res.render("rooms/room-details", room);
    });
});

router
  .route("/create")
  .get(isLoggedIn, (req, res) => {
    res
      .render("rooms/create-room")
      .catch((err) =>
        console.log(`There was an error accessing the create form: ${err}`)
      );
  })
  .post((req, res) => {
    const { name, description, imgUrl } = req.body;
    const ownerId = req.session.user._id;

    Room.create({ name, description, imgUrl, owner: ownerId })
      .then(res.redirect("/rooms"))
      .catch((err) =>
        console.log(`There was an error creating a room: ${err}`)
      );
  });

router.route("/").get((req, res) => {
  Room.find()
    .then((rooms) => res.render("rooms/rooms", { rooms }))
    .catch((err) =>
      console.log(`There was an error showing the rooms: ${err}`)
    );
});

module.exports = router;
