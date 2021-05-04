import React from "react";
import logo from "../Logo.svg";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <img className="logo" src={logo} alt="Logo" />
    </div>
  );
}
