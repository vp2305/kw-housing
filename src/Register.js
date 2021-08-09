import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useStateValue } from './StateProvider';
import { actionTypes } from "./reducer";
import { auth, provider } from './firebase';
import db from './firebase';
import "./Register.css";


// Form validation before submission
// Layout and everything still need to be done

function Register() {
    const history = useHistory();
    const passwordType = document.querySelector("#password");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [{}, dispatch] = useStateValue(); 

    const handleDifferentPages = (e) => {
        
        if (e.target.id === "Login"){
            history.push("/login");
        } else {
            history.push("/");
        }
    }


    const signUp = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            db
            .collection('users')
            .doc(authUser.user?.uid)
            .set({
                firstName: firstName,
                lastName: lastName,
                phone: phoneNumber,
                birthDate: dob,
                email: email,
                userId: authUser.user?.uid
            })
            
            history.push('/')
            return authUser.user.updateProfile({
              displayName: firstName,
            })
        })
        .catch((error) => alert(error.message));
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

    const signUpGoogle = (event) => {
        event.preventDefault();
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
        .catch(console.log("Error occurred"));
    }

    return (
        <div className="Register">
            <img 
                src= "Images/Header/bgblack.png"
                alt = ""
                onClick={handleDifferentPages}
                className = "registerLogo"
                />
            <div className="register__Container">
                <div className="register__leftContainer">  
                    <img src= "/Images/Register/Scrolling on iPhone.gif" alt = "" />
                </div>
                <div className="register__rightContainer">
                    <div className="register__formContainer">
                        <p id = "alreadyHaveAccount">Already have an account? <strong id = "Login" onClick={handleDifferentPages}>Login</strong></p>
                        <h1>Create account</h1>
                        <form className="registerForm">
                            <div className="flexFormLine">
                                <p id = "formInfoFlex">
                                    First Name
                                    <input 
                                        className="inputFieldFlex"
                                        type="text"
                                        onChange={e => setFirstName(e.target.value)}
                                    />
                                </p>
                                <p id = "formInfoFlex">
                                    Last Name
                                    <input 
                                        className="inputFieldFlex"
                                        type="text"
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </p>
                            </div>
                            
                            <div className="flexFormLine">
                                <p id = "formInfoFlex">
                                    Phone Number
                                    <input 
                                        className="inputFieldFlex"
                                        type="text"
                                        onChange={e => setPhoneNumber(e.target.value)}
                                    />
                                </p>
                                <p id = "formInfoFlex">
                                    Date Of Birth
                                    <input 
                                        className="inputFieldFlex"
                                        type="text"
                                        onChange={e => setDob(e.target.value)}
                                    />
                                </p>
                            </div>

                            <p id = "formInfo">
                                Email Address
                                <input 
                                    className="inputField"
                                    type="text"
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </p>

                            <p id = "formInfo">
                                Password
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
                            </p>
                            <div className="signUp__Container">
                                <Button onClick={signUp} variant="contained" color="primary">Sign Up</Button>
                            </div>
                            <div className = "signUp__Divider">
                                    <div className="signUp__DividerContainer">
                                        <hr/>
                                        <p>or</p>
                                        <hr/>
                                    </div>
                                    <Button variant="contained" color="primary" type ="submit" onClick={signUpGoogle}>
                                        <span className="googleSpanContainer">
                                            <img className = "googleButtonImage" src = "/Images/Login/google.png" alt = "" />
                                            Sign Up With Google
                                        </span>
                                    </Button>
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
