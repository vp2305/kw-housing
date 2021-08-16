import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import db from './firebase';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import "./PostView.css";
import { Avatar, Button } from '@material-ui/core';
import { useStateValue } from './StateProvider';
import { IconButton } from '@material-ui/core';
import { MdFavorite } from 'react-icons/md';
import { GrFavorite } from 'react-icons/gr';
import firebase from 'firebase';

function PostView() {
    const {postId} = useParams();
    const [property, setProperty ] = useState([]);
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(0);
    const [features, setFeatures] = useState([]);
    const [message, setMessage] = useState('');
    const [{user}] = useStateValue();
    const [sellerPost, setSellerPost] = useState(false);
    const [fav, setFav] = useState(false);
    const [userFav, setUserFav] = useState([]);
    const [buttonStatus, setButtonStatus] = useState(false);
    const [currentFav, setCurrentFav] = useState([]);

    useEffect(() => {
        alreadyFriendCheck();
        userFav.map((favDoc)=>{
            if (fav === false) {
                if (favDoc.id === postId){
                    setFav(true);
                } 
            }
        });
    },[userFav])

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
    },[postId])

    useEffect(() => {
        if (property?.sellerUID === user?.uid){
            setSellerPost(true);
        } else {
            setSellerPost(false);
        }
        setCurrentFav(property?.favorites)
    },[property])

    useEffect(() => {
        updateLength();
        db
        .collection('users')
        .doc(user?.uid)
        .collection('favorites')
        .onSnapshot (snapshot => {
            setUserFav(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            })));
        })
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

    const favStatus = () => {
        if (user){
            console.log(fav);
            if (fav === false) {
                db
                .collection('users')
                .doc(user?.uid)
                .collection('favorites')
                .doc(postId)
                .set({
                    address: property?.address,
                    city: property?.city,
                    unitNumber: property?.unitNumber, 
                    zipCode: property?.zipCode,
                    listingTitle: property?.listingTitle,
                    bedrooms: property?.bedrooms,
                    bathrooms: property?.bathrooms,
                    description: property?.description,
                    buildingType: property?.buildingType,
                    fromDate: property?.fromDate,
                    rentDuration: property?.rentDuration,
                    leaseType: property?.leaseType,
                    genderSpecification: property?.genderSpecification,
                    pricePerMonth: property?.pricePerMonth,
                    utilityPricePerMonth: property?.utilityPricePerMonth,
                    sellerUID: property?.sellerUID,
                    sellerName: property?.sellerName,
                    features: features,
                    imageURLS: images,
                    latitude: property?.latitude,
                    longitude: property?.longitude,
        
                });
                
                // Add user to the favorites list for the property
                console.log(property?.favorites);
                var availablePropertyDoc = db.collection("availableProperty").doc(postId);
                if (currentFav.indexOf(user?.uid) === -1){
                    currentFav.push(user?.uid)
                    availablePropertyDoc.update({
                        favorites: currentFav
                    });
                }
                setFav(true);
            } else { 
                var availablePropertyDoc = db.collection("availableProperty").doc(postId);
                if (currentFav.indexOf(user?.uid) !== -1){
                    var currentFavIndex = currentFav.indexOf(user?.uid);
                    currentFav.splice(currentFavIndex, 1)
                    availablePropertyDoc.update({
                        favorites: currentFav
                    });
                }

                db
                .collection('users')
                .doc(user?.uid)
                .collection('favorites')
                .doc(postId)
                .delete();
                setFav(false);
            }
        } else {
            alert("Please sign in to add this property to your favorites list!")
        }
        
    }

    const alreadyFriendCheck = () => {
        let peopleStatus = false;
        db
        .collection("users")
        .doc(property?.sellerUID)
        .collection("friends")
        .onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
                if (doc.data().otherUID === user?.uid){;
                    peopleStatus = true; 
                }
                else {
                    peopleStatus = false;
                }
            })
            if (peopleStatus === true){
                setButtonStatus(true);
            } 
        });
    }

    useEffect(() => {
        console.log("Button status" + buttonStatus);
    },[buttonStatus])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user){
            if (buttonStatus === true){
                alert("You have already contacted this seller before check messages!");
            } else if (buttonStatus === false){
                newFriend()
            }
        } else {
            alert("You need to sign-in before connecting with the seller!");
        }   
    }

    const newFriend = () => {
        if (message !== ""){
            const doc = db.collection('users').doc(user?.uid).collection('friends').doc();
            const otherDoc = db.collection('users').doc(property?.sellerUID).collection('friends').doc();
            const id = doc?.id;
            const otherId = otherDoc?.id;
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
        } else {
            alert("Please write a message before submitting!");
        }
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
        setButtonStatus(true);
        alert("Your message is sent, please check your message tab!");
    }

    return (
        <div className="postView">
            <div className="postView__wrapper">
                <h1>{property.listingTitle} ·
                    <span onClick = {favStatus}>
                        {fav ?(
                            <IconButton>
                                <MdFavorite id = "filled__favIcon"/>
                            </IconButton>
                        ):(
                            <IconButton>
                                <GrFavorite id = "unFilled__favIcon"/>
                            </IconButton>
                        )}
                        ⤎ <i>{currentFav?.length}</i> 
                    </span> 
                </h1>
                <p>${property.pricePerMonth} / Month · {property.address} · Bedrooms: {property.bedrooms} · Bathrooms: {property.bathrooms}</p>
                <div className="postView__flex">
                    <div className="postView__flexLeft">
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
                        <div className = {sellerPost ? 'messageDisplayNone' : 'message__card'}>
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
                                <Button id = "messageButton" className = "sendButton" onClick={handleSubmit}>Send Message</Button>
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
                                    <p>{property?.rentDuration}</p>
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
