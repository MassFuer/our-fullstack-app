const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// const SALT_ROUNDS = 10;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    userName: {
      type: String,
      required: [true, "Name is required."],
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dpsircfos/image/upload/v1767962250/zwklyengusrksn3cqijm.png",
    },
    pets: [{
      type: Schema.Types.ObjectId,
      ref: "Pet"
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

/*
// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is modified (or new)
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
*/
const User = model("User", userSchema);

module.exports = User;
