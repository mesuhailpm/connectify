// NoChats.js (React Component for when there are no chats)
import React, { useState } from "react";
import API from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat, fetchChatMessages } from "../actions/chatActions";
import { FETCH_MORE_CHAT_SUCCESS } from "../constants/actionTypes";

const SearchChats = ({ isNew = false  }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const authState = useSelector((state) => state.auth);
  const {chatsLoading} = useSelector((state) => state.chat);

  console.log(users);
  console.log(authState);

  const dispatch = useDispatch();
  
  const handleUserClick = async (user) => {
    if(!authState.user._id) {alert(' no user in authState; user is: '+authState.user) ; return};

    if(!user) {alert('no user selected, user is: '+ user); return}
    console.log(user, ' is user clicked and selected(from searchChats)')
    
    console.log({ participants: [user._id, authState.user._id] });

    try {
      // Send a request to check if a chat already exists, otherwise create a new one
      const response = await API.post(`/api/chats/new`, { participants: [user._id, authState.user._id] }) // Send selected user ID
      console.log(response)
      
      const chat = await response.data.data;
      console.log(chat, ' is the chat')
      
      if (response.data.success) {
        // Update chat list with the newly created or fetched chat
        dispatch({type: FETCH_MORE_CHAT_SUCCESS, payload:chat})
        // setChatList((prevChats) => [...prevChats, data.chat]);
        // Optionally, select the chat to open in the Chat Panel
        setActiveChat(chat._id);
        setSearchTerm("")
        setUsers([])
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
    
    // Dispatch action to set active chat
    
    // dispatch(setActiveChat(user));
    
    // Fetch chat messages
    // dispatch(fetchChatMessages(user._id));
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
      const { data } = await API.get(
        `/api/users/search?query=${e.target.value}`
      );

      setUsers(data.users); // Update local state with search results
      setSearchLoading(false);
    } catch (err) {
      setSearchLoading(false);
      setError("Error searching users.");
    }
  };

  
  if(isNew && !chatsLoading) return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        No Chats Available
      </h2>
      <p className="text-gray-500 mb-8">
        Looks like you don't have any chats yet. Start a new chat by searching
        for a user below.
      </p>
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for users to chat with..."
          className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-300 focus:border-indigo-500"
        />
      </div>
      <p className="text-gray-400 mt-4">
        Find users by name or email to start chatting.
      </p>

      {/* Loading and Error States */}
      {searchLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Users */}
      <ul className="mt-4">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`py-2 hover:bg-yellow-200 hover:border-black border-2 hover:cursor-pointer p-2`}
          >
            <span> <b>{user.username}</b></span> ({user.email})
          </li>
        ))}

        {(!searchLoading && !users?.length && searchTerm) && <p>No users found</p>}
      </ul>

      {/* Call-to-Action to Start a Chat */}
    </div>
  );

  return <div className="flex flex-col items-center justify-center text-center bg-gray-100 p-4">
  
  
  {/* Search Input */}
  <div className="relative w-full max-w-md">
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search for users to chat with..."
      className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-300 focus:border-indigo-500"
    />
  </div>
  <p className="text-gray-400">
    Find users by name or email to start chatting.
  </p>

  {/* Loading and Error States */}
  {searchLoading && <p>Loading users...</p>}
  {error && <p className="text-red-500">{error}</p>}

  {/* Display Users */}
  <ul className="mt-4">
    {users.map((user) => (
      <li
        key={user._id}
        onClick={() => handleUserClick(user)}
        className="p-2 hover:bg-yellow-500 hover:cursor-pointer"
      >
        {user.username} ({user.email})
      </li>
    ))}

    {(!searchLoading && !users?.length && searchTerm) && <p>No users found</p>}
  </ul>

</div>

};

export default SearchChats;
