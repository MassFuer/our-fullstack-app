import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPet, setEditingPet] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    breed: "",
    description: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (currentUser?._id) {
      fetchUserPets();
    }
  }, [currentUser]);

  const fetchUserPets = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5005/pets/owner/${currentUser._id}`
      );
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet._id);
    setEditForm({
      name: pet.name,
      age: pet.age,
      breed: pet.breed,
      description: pet.description,
      profilePicture: pet.profilePicture,
    });
  };

  const handleUpdatePet = async (petId) => {
    try {
      const response = await axios.put(
        `http://localhost:5005/pets/${petId}`,
        editForm
      );
      setPets(pets.map((pet) =>
        pet._id === petId ? response.data : pet
      ));
      setEditingPet(null);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPet(null);
    setEditForm({
      name: "",
      age: "",
      breed: "",
      description: "",
      profilePicture: "",
    });
  };

  const handleAddPet = async () => {
    try {
      const response = await axios.post("http://localhost:5005/pets/create", {
        ...newPetForm,
        owner: currentUser._id,
      });
      setPets([...pets, response.data.newPet]);
      setShowAddPetForm(false);
      setNewPetForm({
        name: "",
        age: "",
        breed: "",
        description: "",
        profilePicture: "",
      });
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  const handleCancelAdd = () => {
    setShowAddPetForm(false);
    setNewPetForm({
      name: "",
      age: "",
      breed: "",
      description: "",
      profilePicture: "",
    });
  };

  console.log(currentUser);
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {currentUser?.userName}!</p>
      <p>Your email is: {currentUser?.email}</p>
      <p>-- Profile Pic --</p>
      <p>
        Last Updated on{" "}
        {currentUser?.updatedAt?.split("T")[0].split("-").reverse().join("-")}
      </p>
      <img src={currentUser?.profilePicture} alt={currentUser?.userName} />

      <h2>Your Pets</h2>
      <p><a href="/add-pet">Add New Pet</a></p>
      {loading ? (
        <p>Loading pets...</p>
      ) : pets.length === 0 ? (
        <p>You don't have any pets yet.</p>
      ) : (
        <div>
          {pets.map((pet) => (
            <div key={pet._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              {editingPet === pet._id ? (
                <div>
                  <h3>Edit Pet</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Breed"
                    value={editForm.breed}
                    onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Profile Picture URL"
                    value={editForm.profilePicture}
                    onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                  />
                  <button onClick={() => handleUpdatePet(pet._id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{pet.name}</h3>
                  <p>Age: {pet.age}</p>
                  <p>Breed: {pet.breed}</p>
                  <p>Description: {pet.description}</p>
                  {pet.profilePicture && (
                    <img src={pet.profilePicture} alt={pet.name} style={{ width: "100px" }} />
                  )}
                  <button onClick={() => handleEditPet(pet)}>Edit Pet</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
