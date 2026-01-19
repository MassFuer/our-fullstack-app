import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const createdUser = await axios.post(
      //   "http://localhost:5005/auth/signup",
      //   {
      //     userName,
      //     email,
      //     password,
      //   },
      // );
      // console.log(createdUser.data);

      // another way with destructuring
      const { data } = await axios.post("http://localhost:5005/auth/signup", {
        userName,
        email,
        password,
      });
      console.log(data);
      nav("/login");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div>
      <h1>Signup Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
