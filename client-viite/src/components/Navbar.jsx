import { NavLink } from "react-router-dom";
import logo from "../assets/gh.jpg";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { handleLogOut, isLoggedIn } = useContext(AuthContext);
  return (
    <nav>
      <img src={logo} alt="logo" />
      <h2>Our Fullstack App</h2>
      {isLoggedIn ? (
        <button onClick={handleLogOut}>Logout</button>
      ) : (
        <section>
          <NavLink to="/">Signup</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </section>
      )}
    </nav>
  );
};
export default Navbar;
