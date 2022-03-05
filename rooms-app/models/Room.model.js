const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    name: String,
    description: String,
    imgUrl: String,
    owner: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    reviews: []
  } 
);

const Room = model("Room", roomSchema);

module.exports = Room;
