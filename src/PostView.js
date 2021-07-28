import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import db from './firebase';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import "./PostView.css";
import { Avatar, Button } from '@material-ui/core';
import { useStateValue } from './StateProvider';
import firebase from "firebase";

function PostView() {
    const {postId} = useParams();
    const [property, setProperty ] = useState([]);
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(0);
    const [features, setFeatures] = useState([]);
    const [message, setMessage] = useState('');
    const [{user}] = useStateValue();
    const [alreadyFriend, setAlreadyFriend] = useState(null);
    const [sellerFriends, setSellerFriends] = useState([]);
    useEffect(() => {
        
        db
        .collection("availableProperty")
        .doc( postId )
        .onSnapshot (snapshot => {
            setProperty(snapshot.data());
        })

        db
        .collection("availableProperty")
        .doc(postId)
        .onSnapshot (snapshot => {
            setImages(snapshot.data()?.imageURLS);
        })

        db
        .collection("availableProperty")
        .doc(postId)
        .onSnapshot (snapshot => {
            setFeatures(snapshot.data()?.features);
        })

        console.log(features);

    },[postId])

    useEffect(() => {
        updateLength();
    },[images])

    const nexSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }

    const previousSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    const updateLength = () => {
        setLength(images.length);
    }

    const userButton = (e) => {
        e.preventDefault();
        // We will be going into the database and check to see if the user uid is on the sellers friends tab. If so then return true since they are already friends or else return false.
        db
        .collection("users")
        .doc(property?.sellerUID)
        .collection("friends")
        .onSnapshot((snapshot) => {
            setSellerFriends(snapshot.docs.map((doc) => doc.data()));
        });

    }
    useEffect(() => {
        sellerFriends.map((f)=>{
            if (f.otherUID === user?.uid){
                setAlreadyFriend(true);
            } else {
                setAlreadyFriend(false);
            }
        });
    },[sellerFriends])

    useEffect(() => {
        console.log(alreadyFriend);
        if (alreadyFriend){
            alert("You guys are already friends!");
        } else if (alreadyFriend === false) {
            newFriend();
        }

    },[alreadyFriend])

    const newFriend = () => {
        const doc = db.collection('users').doc(user?.uid).collection('friends').doc();
        const otherDoc = db.collection('users').doc(property?.sellerUID).collection('friends').doc();
        const id = doc.id;
        const otherId = otherDoc.id;
        doc.set({
            name: property?.sellerName,
            otherUID: property?.sellerUID,
            otherRoomId: otherId,    
        });

        otherDoc.set({
            name: user?.displayName,
            otherUID: user?.uid,
            otherRoomId: id, 
        });
        sendMessage(id, otherId);
        document.getElementById("messageTextArea").value = "";
    }

    const sendMessage = (id, otherId) => {
        db
        .collection('users')
        .doc(user?.uid)
        .collection('friends')
        .doc(id)
        .collection('messages')
        .add({
            message: message,
            name: user?.displayName,
            email: user?.email,
            timestamps: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db
        .collection('users')
        .doc(property?.sellerUID)
        .collection('friends')
        .doc(otherId)
        .collection('messages')
        .add({
            message: message,
            name: user?.displayName,
            email: user?.email,
            timestamps: firebase.firestore.FieldValue.serverTimestamp(),
        });
        alert("Your message is sent!");
    }

    return (
        <div className="postView">
            <div className="postView__wrapper">
                <div className="postView__flex">
                    <div className="postView__flexLeft">
                        <h1>{property.listingTitle}</h1>
                        <p>${property.pricePerMonth} / Month · {property.address} · Bedrooms: {property.bedrooms} · Bathrooms: {property.bathrooms} </p>
                        
                        <div className="postView__card">
                            <h2>Available Features</h2>
                            <div className="postView__featuresContainer">
                                {features.map((feature) => {
                                    return (
                                        <p>➥ {feature} </p>
                                    )
                                })}
                            </div>
                        </div>
                        <div className = "message__card">
                            <div className="postView__sellerContainer">
                                <span className="sellerContainer__header">
                                    <Avatar />
                                    <h2>{property?.sellerName}</h2>
                                </span>
                                <textarea
                                    className="messageContainer"
                                    type="text"
                                    spellcheck="true"
                                    placeholder="Message here!"
                                    id = "messageTextArea"
                                    onChange={e => setMessage(e.target.value)}
                                />
                                <Button variant="contained" type='primary' id = "messageButton" className = "sendButton" onClick={userButton}>Send Message</Button>
                            </div>   
                        </div>
                    </div>
                    <div className = "postView__flexRight">
                        <div id="postView__Media">
                            <div className='postView_media__preview'>
                                <FaArrowAltCircleLeft className="left-arrow" 
                                onClick={previousSlide} />
                                <FaArrowAltCircleRight className="right-arrow" onClick={nexSlide} />
                                {images.map((url, index) => {
                                    return (
                                        <div className={index === current ? 'slide active' : 'slide'} key={index}>
                                            {index === current && (
                                                <img src={url} alt='travel image' className="postView-image" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="postView__additionalDetails">
                    <h1>Additional Details</h1>
                    <div className="postView__columns">
                        <div className="postView_columnsContainer">
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/material-rounded/28/000000/key-exchange.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Lease Type</p>
                                    <p>{property?.leaseType}</p>
                                </div>
                            </div>
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/windows/28/000000/calendar.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Start Date</p>
                                    <p>{property?.fromDate}</p>
                                </div>
                            </div>
                        </div>


                        <div className="postView_columnsContainer">
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/material-outlined/28/000000/hourglass--v2.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Rent Duration</p>
                                    <p>{property?.rentDuration} Months</p>
                                </div>
                            </div>
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/ios/28/000000/gender.png"/>    
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Gender Details</p>
                                    <p>{property?.genderSpecification}</p>
                                </div>
                            </div>
                        </div>


                        <div className="postView_columnsContainer">
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/ios/28/000000/lounge.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Available Rooms</p>
                                    <p>{property?.bedrooms}</p>
                                </div>
                            </div>
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/ios/28/000000/building.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Building Type</p>
                                    <p>{property?.buildingType}</p>
                                </div>
                            </div>
                        </div>

                        <div className="postView_columnsContainer" id="lastColumn">
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/material-outlined/28/000000/estimate.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Estimate Utility/Month</p>
                                    <p>$ {property?.utilityPricePerMonth}</p>
                                </div>
                            </div>
                            <div className="postView_columnItem">
                                <img src="https://img.icons8.com/material-sharp/28/000000/bath.png"/>
                                <div className="postView_columnItemLine2">
                                    <p id = "columnLine1">Number of Washrooms</p>
                                    <p>{property?.bathrooms}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="postView__description">
                    <h2>{property?.address} · ${property.pricePerMonth} / Month</h2>
                    <p>{property?.description}</p>
                </div>
            </div>
        </div>
    )
}

export default PostView;
