const router = require("express").Router();
const Pet = require("../models/Pet.model");
const User = require("../models/User.model");

// a /create route to create a new pet
router.post("/create", async (req, res) => {
  try {
    const { name, age, owner, breed, description, profilePicture } = req.body;
    // validate required fields
    if (!name || !owner) {
      return res.status(400).json({ message: "Name and owner are required." });
    }
    const newPet = await Pet.create({
      name,
      age,
      owner,
      breed,
      description,
      profilePicture,
    });
    // add pet to user's pets array
    const updatedUser = await User.findByIdAndUpdate(
      owner,
      { $push: { pets: newPet._id } },
      { new: true }
    );
    res.status(201).json({ newPet, updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// a /pets route to get all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().populate(
      "owner",
      "userName email profilePicture"
    );
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all pets by owner (must be before /:petId to avoid "owner" being matched as petId)
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.params.ownerId }).populate(
      "owner",
      "userName email profilePicture"
    );
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a single pet by ID
router.get("/:petId", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId).populate(
      "owner",
      "userName email profilePicture"
    );
    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update a pet by ID
router.put("/:petId", async (req, res) => {
  try {
    const { name, age, breed, description, profilePicture } = req.body;
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.petId,
      { name, age, breed, description, profilePicture },
      { new: true, runValidators: true }
    ).populate("owner", "userName email profilePicture");
    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found." });
    }
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a pet by ID
router.delete("/:petId", async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.petId);
    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found." });
    }
    // remove pet from user's pets array
    await User.findByIdAndUpdate(deletedPet.owner, {
      $pull: { pets: deletedPet._id },
    });
    res.status(200).json({ message: "Pet deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
