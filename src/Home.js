import React from 'react';
import "./Home.css";
import { Button } from '@material-ui/core';

function Home() {
    return (
        <div className="Home">
            <div className="bot__container">
                <div className="home__title">
                    <h2>KW Housing</h2>
                    <div className="home__subtitle">
                    <h1>Housing Marketplace for Kitchener Waterloo Region</h1>
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
        </div>
    )
}

export default Home;
