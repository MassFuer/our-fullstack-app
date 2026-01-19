import { NavLink } from "react-router-dom";
import logo from "../assets/gh.jpg";

const Navbar = () => {
  return (
    <nav>
      <img src={logo} alt="logo" />
      <h2>Our Fullstack App</h2>
      <section>
        <NavLink to="/">Signup</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/logout">Logout</NavLink>
      </section>
    </nav>
  );
};
export default Navbar;
