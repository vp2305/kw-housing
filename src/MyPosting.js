import React, { useEffect, useState } from 'react';
import "./MyPosting.css";
import db from "./firebase";
import { useStateValue } from './StateProvider';
import { Button } from '@material-ui/core';

function MyPosting() {
    const [postings, setMyPostings] = useState([]);
    const [{user}] = useStateValue();
    useEffect(() => {
        if (user) {
            db
            .collection('users')
            .doc(user?.uid)
            .collection('userSellingProperty')
            .onSnapshot((snapshot)=>
                setMyPostings(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
        }
    },[])

    return (
        <div className = "myPosting">
            <div className = "myPosting__wrapper">
                <h1>My Postings</h1>
                <hr/>
                <div className = "post__wrapper">
                    {postings.map((post) => (
                        <div className = "post__container">
                            <div className = "post__leftContainer">
                                <img src = {post.data.imageURLS[0]} alt = "" className="post__image"/>
                            </div>
                            <div className = "post__rightContainer">
                                <h2>{post.data.address}</h2>
                                <h4>${post.data.pricePerMonth} / Month</h4>
                                <span className = "post__bedroom__washroom">
                                    <img src="https://img.icons8.com/ios-glyphs/30/000000/bedroom.png" alt = "bedroom icon" className="post__imageIcon" />
                                    <h4>Bedrooms: {post.data.bedrooms}</h4>
                                    <img id = "washrooms" src="https://img.icons8.com/material-sharp/30/000000/bath.png" alt = "bath icon" className="post__imageIcon"/>
                                    <h4 >Washrooms: {post.data.bathrooms}</h4>
                                </span>
                                <p>{post.data.description}</p>
                                <Button variant="contained" type="primary">View</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyPosting;
