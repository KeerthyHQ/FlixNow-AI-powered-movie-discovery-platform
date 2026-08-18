import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <div className="fixed top-0 w-full z-50">
      <div
        className="flex items-center justify-between px-8 py-4 
      bg-black/80 backdrop-blur-md border-b border-gray-800"
      >
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-md object-cover"
          />

          <h1 className="text-2xl font-bold text-red-600 tracking-wide">
            <span className="text-white">FLIX</span> NOW
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-300 font-medium hover:text-white transition duration-300"
          >
            Movies
          </Link>

          <Link
            to="/watchlist"
            className="text-gray-300 font-medium hover:text-white transition duration-300"
          >
            Watchlist
          </Link>

          <Link
            to="/mood"
            className="text-gray-300 font-medium hover:text-white transition duration-300"
          >
            AI Vibe Check
          </Link>
          <Link
            to="/recommendations"
            className="text-gray-300 font-medium hover:text-white transition duration-300"
          >
            AI Recommendations
          </Link>
          <Link
            to="/smart-search"
            className="text-gray-300 font-medium hover:text-white transition duration-300"
          >
            Smart Search
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
