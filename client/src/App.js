import Nav from "./containers/Nav";
import Footer from "./containers/Footer";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import Chats from "./containers/Chats";
import Home from "./containers/Home";
import Help from "./containers/Help";
import "./App.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { loadUserFromToken } from "./actions/authActions";
import SignedInIndicator from "./components/SignedIndicator";
import About from "./containers/About";

function App() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    dispatch(loadUserFromToken()); // Load the user from the token on app load
  }, [dispatch]);

  return (
    <div className="flex flex-col grow bg-gray-200 border-4 w-full min-h-dvh border-red-700 px-2">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Nav />
      <header className="bg-gray-800 p-4">
        <SignedInIndicator />
      </header>

      <main className="w-full min-h-dvh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chats"
            element={
              isAuthenticated ? <Chats /> : <Navigate to={"/login"} replace />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/help" element={<Help />} />
<Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
