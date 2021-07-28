import React from 'react';
import "./Home.css";
import { Button } from '@material-ui/core';

function Home() {
    return (
        <div className="Home">
            <div className="bot__container">
                <div className="home__title">
                    <h2>Housing Marketplace for <br/> Kitchener Waterloo Region</h2>
                    <div className="buttonContainer">
                        <Button variant="contained" type="primary">
                            Browse Listing
                        </Button>
                        <Button variant="contained" type="primary">
                            Post Listing
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
