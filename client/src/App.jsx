import Nav from "./containers/Nav";
import Footer from "./containers/Footer";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import Chats from "./containers/Chats";
import Home from "./containers/Home";
import Help from "./containers/Help";
import "./App.css";
import {  useDispatch, useSelector } from "react-redux";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { loadUserFromToken } from "./actions/authActions";
import SignedInIndicator from "./components/SignedIndicator";
import About from "./containers/About";
import socket from "./sockets/socket";
import { RECEIVE_MESSAGE } from "./constants/actionTypes";
import incomingTone from "./assets/media/ding.mp3";
import { fetchUnreadMessageNotifications } from "./actions/messageNotificationActions";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { chats, mutedChats } = useSelector((state) => state.chat);
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const [userInteracted, setUserInteracted] = useState(false);
  const { error: chatError } = useSelector((state) => state.chat);
  const { error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleUserInteraction);
    };
    document.addEventListener("click", handleUserInteraction);
    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    dispatch(loadUserFromToken()); // Load the user from the token on app load
  }, [dispatch, loading]);

  useEffect(() => {
    if (user && user._id) {
      socket.emit("registerUser", user._id.toString());
      socket.emit("user-connected", user._id.toString());
    }
  }, [user]);

  useEffect(() => {
        const isOnChatsPage = location.pathname === "/chats" ? true : false
      
    if (isAuthenticated) {
      dispatch(fetchUnreadMessageNotifications(user._id,isOnChatsPage))
    }
  }, [isAuthenticated, dispatch, chats]);
  

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("receiveMessage", (message) => {
      const {
        chat,
        content,
        sender,
        status,
        updatedAt,
        createdAt,
        readBy,
        _id,
      } = message;
      console.log("Received a new message from server:", message);

      const convertMessage = () => {
        try {
          return {
            chat,
            content,
            createdAt,
            updatedAt,
            readBy,
            sender,
            status,
            _id,
          };
        } catch (error) {
          console.log("unable to convert message to state", error);
          return {};
        }
      };
      const messageForState = convertMessage();
      // You can update the message state here, e.g., push to messages
      dispatch({
        type: RECEIVE_MESSAGE,
        payload: messageForState,
        isOnChatsPage: location.pathname === "/chats" ? true : false,
      });

      const isChatMuted = mutedChats.some((chat) => chat === message.chat);
      if (!isChatMuted) {
        
        if (userInteracted) {
          const audio = new Audio(incomingTone);
          audio.play();
          return
        } 
          alert("You have a notification!");
        
      };
      
      
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userInteracted, location.pathname, dispatch]);

  return (
    <>
      <div className="md:hidden flex items-center justify-center h-full">
        <h2 className="text-center text-2xl font-bold text-primary">Not Viewable on Mobile. Please Use a Larger Screen.</h2>
      </div>
    <div className="app hidden relative md:flex flex-col bg-primary/50 border-4 w-full overflow-hidden border-red-700 px-2 h-full">
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
      <header className="bg-primary  p-4 h-[80px]" >
        <SignedInIndicator />
      </header>

      <main className="flex grow max-h-full overflow-scroll hide-scrollbar">
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
 </>
  );
}

export default App;
