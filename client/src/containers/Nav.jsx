import React from "react";
import logo from "../../src/default-monochrome.svg";
import "../App.css";

import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Nav = () => {
  return (
    <nav className="flex w-full justify-between items-center font-bold  min-h-[30px]">
      <Link className="flex" to={"/"}
      onClick={(e) => {
        if (window.location.pathname === "/chats") {
          e.preventDefault();
        }
      }}     
      >
        <img src={logo}  width={'150rem'} className="bg-red-50/30 p-2 rounded-md" alt="Logo" />
      </Link>
      <div className="links w-fit flex items-center justify-center gap-4">
        <Link to="/login"> Login</Link>
        <Link to="/chats"> Chats</Link>
        <Link to="/about"> About</Link>
      </div>
    </nav>
  );
};

export default Nav;
