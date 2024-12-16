import React, { useState } from "react";
import API from "../api";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages } from "../actions/chatActions";
import { FETCH_MORE_CHAT_SUCCESS, SELECT_CHAT } from "../constants/actionTypes";

const SearchChats = ({ isNew = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const authState = useSelector((state) => state.auth);
  const { chatsLoading, chats } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const handleUserClick = async (user) => {
    if (!authState.user._id) {
      alert("No user in authState; user is: " + authState.user);
      return;
    }

    if (!user) {
      alert("No user selected, user is: " + user);
      return;
    }
    console.log(user, " is user clicked and selected(from searchChats)");

    console.log({ participants: [user._id, authState.user._id] });

    try {
      const response = await API.post(`/api/chats/new`, {
        participants: [user._id, authState.user._id],
      });
      console.log(response);

      const chat = await response.data.data;
      console.log(chat, " is the chat");

      if (response.data.success) {
        if (chats.some((el) => el._id === chat._id)) {
          await dispatch({ type: SELECT_CHAT, payload: chat });
        } else {
          dispatch({ type: FETCH_MORE_CHAT_SUCCESS, payload: chat });
          await dispatch({ type: SELECT_CHAT, payload: chat });
        }
        setSearchTerm("");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < users.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleUserClick(users[selectedIndex]);
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.trim() === "") {
      setUsers([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError("");
      const { data } = await API.get(`/api/users/search?query=${e.target.value}`);

      setUsers(data.users);
      setSearchLoading(false);
    } catch (err) {
      setSearchLoading(false);
      setError("Error searching users.");
    }
  };

  const renderSearchInput = () => (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onKeyDown={handleKeyDown}
        onChange={handleSearch}
        placeholder="Search for users to chat with..."
        className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-300 focus:border-indigo-500"
      />
    </div>
  );

  const renderUserList = () => (
    <ul className="mt-4">
      {users.map((user, index) => (
        <li
          key={user._id}
          onMouseEnter={() => setSelectedIndex(index)}
          onClick={() => handleUserClick(user)}
          className={`py-2 ${selectedIndex === index ? 'bg-yellow-200 border-black ' : ' '} border-2 p-2`}
        >
          <span><b>{user.username}</b></span> ({user.email})
        </li>
      ))}
      {!searchLoading && !users.length && searchTerm && <p>No users found</p>}
    </ul>
  );

  const renderLoadingAndError = () => (
    <>
      {searchLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );

  if (isNew && !chatsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          No Chats Available
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you don't have any chats yet. Start a new chat by searching
          for a user below.
        </p>
        {renderSearchInput()}
        <p className="text-gray-400 mt-4">
          Find users by name or email to start chatting.
        </p>
        {renderLoadingAndError()}
        {renderUserList()}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center bg-gray-100 p-4">
      {renderSearchInput()}
      <p className="text-gray-400">
        Find users by name or email to start chatting.
      </p>
      {renderLoadingAndError()}
      {renderUserList()}
    </div>
  );
};

export default SearchChats;