import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {currentUser?.userName}!</p>
      <p>Your email is: {currentUser?.email}</p>
      <p>-- Profile Pic --</p>
      <p>
        Last Updated on{" "}
        {currentUser?.updatedAt.split("T")[0].split("-").reverse().join("-")}
      </p>
      <img src={currentUser?.profilePicture} alt={currentUser.userName} />
    </div>
  );
};
export default ProfilePage;
