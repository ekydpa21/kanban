import React from "react";
import logo from "../assets/Logo.svg";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <img className="logo" src={logo} alt="Logo" />
    </div>
  );
}
