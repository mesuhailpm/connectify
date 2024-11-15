import React, { useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatMenu from "../components/ChatMenu";
import ChatPanel from "../components/ChatPanel";
import { useDispatch, useSelector } from "react-redux";
import API from "../api";
import {
  FETCH_CHATS_FAILURE,
  FETCH_CHATS_REQUEST,
  FETCH_CHATS_SUCCESS,
} from "../constants/actionTypes";
import { toast } from "react-toastify";

const Chats = () => {
  // const handleSelectUser = (user) => {
  //   setSelectedUser(user); // Update the selected user in state
  // };

  const authState = useSelector((state) => state.auth);
  const chatState = useSelector((state) => state.chat);
  console.log({ authState, chatState });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        dispatch({ type: FETCH_CHATS_REQUEST });
        const { data } = await API.get("/api/chats");
        console.log(data.data);
        dispatch({ type: FETCH_CHATS_SUCCESS, payload: data.data });
      } catch (error) {
        console.log(error)
        dispatch({
          type: FETCH_CHATS_FAILURE,
          payload: error.response?.data?.message || error.message | "Unable to fetch chats",
        });
        toast.error(error.response?.data?.message || error.message || "Unable to fetch chats");
      }
    };
    if (authState.isAuthenticated) {
      fetchChats();
    }
  }, [authState.isAuthenticated]);

  // if (!chats.length && !selectedChat && !selectedChat)
  //   return (
  //     <NoChats
  //       setSelectedUser={setSelectedUser}
  //       setChatList={{ setChatList }}
  //       authState={authState}
  //     />
  //   );
  if (authState.loading) return <>Loading...</>;
  return (
    <>
      <ChatList />
      <ChatPanel />
      <ChatMenu />
    </>
  );
};

export default Chats;
