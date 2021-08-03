import React, { useState } from "react";
import Headroom from "react-headroom";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import "./Header.css";

function Header({ dark }) {
  const [header, setHeader] = useState(false);
  const history = useHistory();
  var checkbox = document.getElementById("menu-btn");
  const [{ user }, dispatch] = useStateValue();

  const handleDifferentPages = (e) => {
    var value = e.target.id;
    if (value === "home") {
      history.push("/");
      try {
        checkbox.checked = false;
      } catch (e) {
        console.log(e);
      }
    } else if (value === "my favorites") {
      history.push("/my-favorites");
      try {
        checkbox.checked = false;
      } catch (e) {
        console.log(e);
      }
    } else if (value === "my posting") {
      history.push("/my-postings");
      try {
        checkbox.checked = false;
      } catch (e) {
        console.log(e);
      }
    } else if (value === "browse listings") {
      try {
        checkbox.checked = false;
      } catch (e) {
        console.log(e);
      }
    } else if (value === "post new listing") {
      history.push("/new-listing");
      try {
        checkbox.checked = false;
      } catch (e) {
        console.log(e);
      }
    } else if (value === "messages") {
      history.push("/messages");
      try {
        checkbox.checked = false;
      } catch (e) {
        console.log(e);
      }
    }
  };

  const backgroundChange = () => {
    if (window.scrollY >= 80) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  const logOut = () => {
    if (user) {
      auth.signOut();
      history.push("/");
    }
  };

  window.addEventListener("scroll", backgroundChange);

  return !dark ? (
    <Headroom>
      <header className={header ? "header active" : "header"}>
        <div className="header__logoContainer">
          <img
            src="/Images/Header/bgwhite.png"
            height="80"
            width="80"
            alt=""
          ></img>
        </div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon"></span>
        </label>
        <ul className="menu">
          <li>
            <a onClick={handleDifferentPages} id="home">
              Home
            </a>
          </li>
          <li>
            <a onClick={handleDifferentPages} id="browse listings">
              Browse Listings
            </a>
          </li>
          <li>
            <a onClick={handleDifferentPages} id="post new listing">
              Post New Listing
            </a>
          </li>

          <li>
            <a onClick={handleDifferentPages} id="my posting">
              My Postings
            </a>
          </li>
          <li>
            <a onClick={handleDifferentPages} id="my favorites">
              My Favorites
            </a>
          </li>

          <li>
            <a onClick={handleDifferentPages} id="messages">
              Messages
            </a>
          </li>
          <li>
            <a onClick={logOut}>Log Out</a>
          </li>
        </ul>
      </header>
    </Headroom>
  ) : (
    <Headroom>
      <header className={header ? "header active" : "header"}>
        <div className="header__logoContainer">
          <img
            src="/Images/Header/bgwhite.png"
            height="80"
            width="80"
            alt=""
          ></img>
        </div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon"></span>
        </label>
        <ul className="menu" id="dark_navTab">
          <li>
            <a onClick={handleDifferentPages} id="home">
              Home
            </a>
          </li>
          <li>
            <a onClick={handleDifferentPages} id="browse listings">
              Browse Listings
            </a>
          </li>
          <li>
            <a onClick={handleDifferentPages} id="post new listing">
              Post New Listing
            </a>
          </li>

          <li>
            <a onClick={handleDifferentPages} id="my posting">
              My Postings
            </a>
          </li>
          <li>
            <a onClick={handleDifferentPages} id="my favorites">
              My Favorites
            </a>
          </li>

          <li>
            <a onClick={handleDifferentPages} id="messages">
              Messages
            </a>
          </li>
          <li>
            <a onClick={logOut}>Log Out</a>
          </li>
        </ul>
      </header>
    </Headroom>
  );
}
export default Header;
