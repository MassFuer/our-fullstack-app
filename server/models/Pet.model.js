const { Schema, model } = require("mongoose");

const petSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    age: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required."],
    },
    breed: {
      type: String,
    },
    description: {
      type: String,
      default: "This pet has no description yet.",
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dpsircfos/image/upload/v1767785860/iusupfporvdzndpojlxu.jpg",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Pet = model("Pet", petSchema);

module.exports = Pet;
