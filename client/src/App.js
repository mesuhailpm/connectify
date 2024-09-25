import Nav from "./containers/Nav";
import Footer from "./containers/Footer";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import Chats from "./containers/Chats";
import Home from "./containers/Home";
import Help from "./containers/Help";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="flex flex-col grow bg-gray-200 border-4 w-full min-h-dvh border-red-700 px-2">
      <Nav />

      <main className="w-full min-h-dvh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/help" element = {<Help />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
