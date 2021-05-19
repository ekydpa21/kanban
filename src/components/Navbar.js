import React from "react";
import { useHistory, useLocation } from "react-router";
import logo from "../assets/kanban-logo.png";

export default function Navbar() {
  const history = useHistory();
  const location = useLocation();

  const logOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    history.push("/login");
  };
  return (
    <div className="navbar">
      <img className="logo" src={logo} alt="Logo" />
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <button className="btn btn-danger" onClick={logOut}>
          Log Out
        </button>
      )}
    </div>
  );
}
