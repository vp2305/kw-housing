import React, { useEffect, useState } from 'react';
import "./MyPosting.css";
import db from "./firebase";
import { useStateValue } from './StateProvider';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import Footer from "./Footer";
import InfoProperty from './InfoProperty';

function MyPosting() {
    const [postings, setMyPostings] = useState([]);
    const [{user}] = useStateValue();
    const history = useHistory();
    const [noPost, setNoPost] = useState(false);
    
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

    useEffect(() => {
        if (postings.length !== 0){
            setNoPost(true);
        }
    },[postings])


    const handleDifferentPages = (e) => {
        e.preventDefault();
        history.push('/new-listing');
    }

    return ( 
        !noPost ?(
            <div className="myPosting">
                <h2>My Postings</h2>
                <div className="picture__wrapper02">
                    <img src="/Images/Seller/mypostingspic.gif" alt = "" />
                </div>
                <div className = "myPosting__wrapper">
                    <hr/>
                    <div className = "post__wrapper">
                        <p>You haven't posted any listings yet.</p>
                        <div className = "myPost__button__container">
                            <Button variant="contained" type="primary" onClick={handleDifferentPages}>Post a Listing</Button>
                        </div>
                    </div>
                </div>
            </div>
        ):(
            <div className = "myPosting">
                <h2>My Postings</h2>
                <div className="picture__wrapper02">
                    <img src="/Images/Seller/mypostingspic.gif" alt = "" />
                </div>
                <div className = "myPosting__wrapper">
                    <hr/>
                    <div className = "post__wrapper">
                        {postings.map((post) => (
                            <div className = "post__container">
                                <InfoProperty 
                                    property = {post}
                                    id = {post.id}
                                    myPosting
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    )
}

export default MyPosting;
