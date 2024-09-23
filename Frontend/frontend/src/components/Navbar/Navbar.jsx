import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { PiGooglePodcastsLogoBold } from "react-icons/pi";
import { FaShoppingCart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import "./Navbar.css";


const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("menu");

  return (
    <div className="navbar">
      <Link to='/'><PiGooglePodcastsLogoBold /></Link>
      <ul className="navbar-menu">
        <li
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </li>
        <li
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </li>
        <li
          onClick={() => setMenu("About-us")}
          className={menu === "About-us" ? "active" : ""}
        >
          About us
        </li>
        <li
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact us
        </li>
      </ul>
      <div className="navbar-right">
        <IoSearchOutline />
        <div className="navbar-search-icon">
          <Link to='/cart'><FaShoppingCart /></Link>
          <div className="dot"></div>
        </div>
        <button onClick={()=>setShowLogin(true)}>sign in</button>
      </div>
    </div>
    
  );
};

export default Navbar;
