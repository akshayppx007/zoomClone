import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/authentication/login";
import Register from "./components/pages/authentication/register";
import MeetingFormPage from "./components/pages/authentication/joinMeet";
import Home from "./components/pages/home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join" element={<MeetingFormPage />} />
          <Route path="/home/:id" element={<Home />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
