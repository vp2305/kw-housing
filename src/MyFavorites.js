import React, { useEffect, useState } from 'react';
import "./MyFavorites.css";
import db from "./firebase";
import { useStateValue } from './StateProvider';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import InfoProperty from './InfoProperty';

function MyFavorites() {
    const [myFavorites, setMyFavorites] = useState([]);
    const [noFav, setNoFav] = useState(false);
    const [{user}] = useStateValue();
    const history = useHistory();
    useEffect(() => {
        if (user) {
            db
            .collection('users')
            .doc(user?.uid)
            .collection('favorites')
            .onSnapshot((snapshot)=>
                setMyFavorites(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
        }
    },[])

    useEffect(() => {
        if (myFavorites.length !== 0){
            setNoFav(true);
        }
        console.log(noFav);
    },[myFavorites])


    return ( 
        !noFav ?(
            <div className="myPosting">
                <h2>My Favorites</h2>
                <div className="picture__wrapper03">
                    <img src="/Images/Seller/myfavouritespic.gif" alt = "" />
                </div>
                <div className = "myPosting__wrapper">
                    <hr/>
                    <div className = "post__wrapper">
                        <p>You don't have any favorite yet...</p>
                        <p>Browse some listings and see what you like!</p>
                    </div>
                </div>
            </div>
        ):(
            <div className="myPosting">
                <h2>My Favorites</h2>
                <div className="picture__wrapper03">
                    <img src="/Images/Seller/myfavouritespic.gif" alt = "" />
                </div>
            
                <div className = "myPosting__wrapper">
                    <hr/>
                    <div className = "post__wrapper">
                        {myFavorites.map((post) => (
                            <div className = "post__container">
                                <InfoProperty 
                                    property = {post}
                                    id = {post.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    )
}

export default MyFavorites;
