import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useStateValue } from './StateProvider';
import { actionTypes } from "./reducer";
import {  auth, provider } from './firebase';
import db from './firebase';
import "./Login.css";
function Login() {
    const history = useHistory();
    const passwordType = document.querySelector("#password");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [{}, dispatch] = useStateValue(); 
    
    const handleDifferentPages = (e) => {
        if (e.target.id === "Register"){
            history.push("/register");
        } else {
            history.push("/");
        }
    }

    const hide_viewPassword = (e) => {
        e.preventDefault();
        try {
            const type = passwordType.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordType.setAttribute('type', type);
        } catch (e) {
            console.log(e);
        }
    }

    const signInEmailPassword = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then(result => {
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user,
            })
            history.push("/")
        })
        .catch(
            error=>alert(error.message)
        )
    }

    const signInGoogle = (e) => {
        e.preventDefault();
        auth.signInWithPopup(provider)
            .then(result => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,  
                })
                let fullName = result.user?.displayName;
                const nameArr = fullName.split(" ");

                db
                .collection('users')
                .doc(result.user?.uid)
                .set({
                    firstName: nameArr[0],
                    lastName: nameArr[1],
                    phone: result.user?.phoneNumber,
                    birthDate: "",
                    email: result.user?.email,
                    userId: result.user?.uid
                })
                    history.push("/")
                })
            .catch(
                console.log("Error occurred")
            );
    }

    return (
        <div className="Login">
            
            <div className="login__container">
                <div className="login__leftContainer">  
                    <div className="login__leftWrapper">
                        <div className="login__leftHeaderContainer">
                            <div className="login__leftHeader">
                                <img onClick={handleDifferentPages}
                                    id = "logo"
                                    src= "Images/Header/logo-black.png"
                                    alt = "" />
                                <h1>Sign In to <br/> Connect With Others!</h1>
                                <p>If you don't have an account <br/> You can <strong id = "Register" onClick={handleDifferentPages}>Register here!</strong></p>
                                <img src= "/Images/Login/image-03.png" alt = "" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="login__rightContainer">
                    <div className = "login__signInWrapper">
                        <div className="login__signInContainer">
                            <div className="login__signInHeader">
                                <h2>Welcome Back!</h2>
                            </div>
                            <form>
                                <input 
                                    className="email"
                                    type="text"
                                    placeholder="Email Address"
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <span>
                                    <input 
                                        type="password"
                                        className="password"
                                        id="password"
                                        placeholder="Password" 
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <svg onClick={hide_viewPassword} id = "togglePassword" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi-bi-eye-slash" viewBox="0 0 16 16">
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                    </svg>
                                </span>
                                <div className="signIn__Container">
                                    <Button variant="contained" color="primary" onClick={signInEmailPassword}>Sign In</Button>
                                </div>
                                <div className = "signIn__Divider">
                                    <div className="sign__DividerContainer">
                                        <hr/>
                                        <p>or</p>
                                        <hr/>
                                    </div>
                                    <Button  variant="contained" color="primary" type ="submit" onClick={signInGoogle}>
                                        <span className="googleSpanContainer">
                                            <img className = "googleButtonImage" src = "/Images/Login/google.png" alt = "" />
                                            Sign in With Google
                                        </span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
