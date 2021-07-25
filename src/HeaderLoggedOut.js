
import "./HeaderLoggedOut.css";
import React, { useEffect, useState } from 'react';
import Headroom from "react-headroom";
import { useHistory } from 'react-router-dom';


function HeaderLoggedOut({dark}) {
    const [header, setHeader] = useState(false);
    const history = useHistory();
    var checkbox = document.getElementById("menu-btn")

    useEffect(()=>{
        console.log("dark" + dark);
    },[])

    const handleDifferentPages = (e) => {
        var value = e.target.id;
        if (value==="home"){
            history.push("/");
            try{
                checkbox.checked=false;
            } catch(e){
                console.log(e);
            }
        } else if (value === "browse listings"){
            try{
                checkbox.checked=false;
            } catch(e){
                console.log(e);
            }
        } else if (value === "post new listing"){
            try{
                checkbox.checked=false;
            } catch(e){
                console.log(e);
            }
        } else if (value === "sign in"){
            history.push("/login");
            try{
                checkbox.checked=false;
            } catch(e){
                console.log(e);
            }
        } else if (value === "register"){
            history.push("/register");
            try{
                checkbox.checked=false;
            } catch(e){
                console.log(e);
            }
        }
    }

    const backgroundChange = () => {
        if (window.scrollY >= 80){
            setHeader(true);
        } else {
            setHeader(false);
        }
    }

    window.addEventListener("scroll", backgroundChange);

    return ( 
        !dark ?(
            <Headroom>
                <header className = {header ? 'header active' : 'header'}>
                    <div className = "header__logoContainer">
                        <img src= "/Images/Header/logo-white.png" alt=""></img>
                    </div>
                    <input className="menu-btn" type="checkbox" id="menu-btn" />
                    <label
                        className="menu-icon"
                        htmlFor="menu-btn"
                        >
                        <span className="navicon"></span>
                    </label>
                    <ul className = "menu">
                        <li>
                            <a onClick={handleDifferentPages} id="home">Home</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="browse listings" >Browse Listings</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="post new listing" >Post New Listing</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="sign in">Sign In</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="register">Register</a>
                        </li>
                    </ul>
                </header>
            </Headroom>
        ) : (
            <Headroom>
                <header className = {header ? 'header active' : 'header'}>
                    <div className = "header__logoContainer">
                        <img src= "/Images/Header/logo-black.png" alt=""></img>
                    </div>
                    <input className="menu-btn" type="checkbox" id="menu-btn" />
                    <label
                        className="menu-icon"
                        htmlFor="menu-btn"
                        >
                        <span className="navicon"></span>
                    </label>
                    <ul className = "menu" id = "dark_navTab">
                        <li>
                            <a onClick={handleDifferentPages} id="home" >Home</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="browse listings" >Browse Listings</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="post new listing" >Post New Listing</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="sign in">Sign In</a>
                        </li>
                        <li >
                            <a onClick={handleDifferentPages} id="sign out">Sign Out</a>
                        </li>
                    </ul>
                </header>
            </Headroom>
        )
    )
}
export default HeaderLoggedOut;
