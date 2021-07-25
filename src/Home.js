import React from 'react';
import "./Home.css";
import { Button } from '@material-ui/core';

function Home() {
    return (
        <div className="Home">
            <div className="bot">
                <img src="/Images/Home/bot_Transperent.gif" alt = ""/>
            </div>
            <div className="bot__container">
                <h2>Hello Vaibhav, <br/> What Are You Looking To-Do Today?</h2>
                <div className="buttonContainer">
                    <Button variant="contained" type='primary'>Browse Listing</Button>
                    <Button variant="contained" type='primary'>Post Listing</Button>
                </div>
            </div>
        </div>
    )
}

export default Home;
