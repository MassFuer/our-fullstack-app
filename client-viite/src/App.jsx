import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Logout from "./pages/Logout.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* route for '/' that shows the Signup page */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* route for '/profile' that shows the Profile page */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* route for '/logout' that shows the Logout page */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;
