import React from "react";
import loadingGif from "../assets/loading1.gif";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img src={loadingGif} alt="loading" />
    </div>
  );
}
