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
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const { error: chatError } = useSelector((state) => state.chat);
  const { error: authError } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(loadUserFromToken()); // Load the user from the token on app load
  }, [dispatch, loading]);

  return (
    <div className="app relative flex flex-col bg-gray-200 border-4 w-full overflow-hidden border-red-700 px-2 h-full">
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
      {chatError ||
        (authError && (
          <div className="fixed font-bold text-center text-2xl bg-yellow-500 p-2">
            {chatError + authError}
          </div>
        ))}
      <Nav />
      <header className="bg-gray-800  p-4 h-[80px]" >
        <SignedInIndicator />
      </header>

      <main className="flex grow max-h-full border-2 overflow-scroll hide-scrollbar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chats"
            element={
              !isAuthenticated && !loading ? (
                <Navigate to={"/login"} replace />
              ) : (
                <Chats />
              )
            }
          />
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

/*
I want my app (div with #root id) to take the width and height of the screen that means that there is no scroll within the app. If the charge cards are more than the screen can include the score should be there, Also if there are messages more than what the Visible space can contain, we should be able to scroll, This scroll should not affect the chat input and the chat boot should be In the bottom side of that chatPanel. As per my current code if there are messages in the chat panel I am not even able to see the chat input, I can see the input in the correct position if there are no messages. Also irrespective of whether messages are there or not the Nav and headers are not anywhere, Now and headers are visible only when there is nuochat selected



*/