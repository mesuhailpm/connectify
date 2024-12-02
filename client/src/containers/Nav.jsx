import React from "react";
import logo from "../../src/logo.svg";
import "../App.css";

import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Nav = () => {
  return (
    <nav className="flex w-full justify-between items-center font-bold  min-h-[30px]">
      <Link className="flex" to={"/"}>
        <img src={logo} width={30} alt="Logo" />
        <h1>Connectify</h1>
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
