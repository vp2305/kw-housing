import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import "./Buyer.css";
import Maps from './Maps';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import db from './firebase';
import BrowseListingInfo from './BrowseListingInfo';

function Buyer() {
    const [rooms, setRooms] = useState('');
    const [coed, setCoed] = useState('');
    const [leaseType, setLeaseType] = useState('');
    const [property, setProperty] = useState([]);
    const [noListings, setNoListings] = useState(false);
    const [maxBudget, setMaxBudget] = useState(-1);
    const [storedListing, setStoredListing] = useState([]);
    const [storedListingStatus, setStoredListingStatus] = useState(false);

    const room__option = [
        '1','2','3','4','5'
    ];

    const coed__option = [
        'Coed', 'Female Only', 'Male Only'
    ];

    const leaseType__option = [
        '4 Month Sublet', '8 Month Sublet', 'Lease'
    ];

    const roomChange = (e) => {
        setRooms(e.value);
    }

    const coedChange = (e) => {
        setCoed(e.value);
    }

    const leaseTypeChange = (e) => {
        setLeaseType(e.value);
    }

    useEffect(() => {
        db
        .collection('availableProperty')
        .onSnapshot((snapshot) => {
            setProperty(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        });
    },[])

    useEffect(() => {
        if (property.length === 0) {
            setNoListings(true);
        } else {
            setNoListings(false);
            if (storedListingStatus === false && storedListing.length === 0) {
                console.log("Initialized Stored Listings");
                console.log(property);
                setStoredListing(property);
                setStoredListingStatus(true);
            }
        }
    }, [property]);


    const searchListing = (e) => { 
        const tempProperty = [];
        console.log(maxBudget);
        if (maxBudget !== "" || rooms !== "" || coed !== "" || leaseType !== "") {
            storedListing.map((post) => {
                if (post.data.pricePerMonth <= maxBudget || post.data.bedrooms === rooms || post.data.genderSpecification === coed || post.data.leaseType === leaseType){
                    tempProperty.push(post);
                }
            });
            setProperty(tempProperty);        
        } 
        else {
            resetListing();
        }
    }
    
    const resetListing = () => {
        setProperty(storedListing); 
        document.getElementById("maxPriceField").value = "";
        setRooms("");
        setCoed("");
        setLeaseType("");
    }
    
    return (
        <div className="buyer">
            <div className="buyer__wrapper">
                <hr id="filter__divider"/>
                <div className="filter_container">

                    <input
                        id = "maxPriceField"
                        type="number"
                        className="filter__inputField"
                        placeholder="Max Budget"
                        min="100"
                        max="10000"
                        onChange={e => setMaxBudget(e.target.value)}
                    /> 

                    <div className="filter__inputField">
                        <Dropdown 
                            id = "roomsDropDown"
                            options={room__option}
                            placeholder="# Rooms"
                            value = {rooms}
                            onChange={roomChange}
                        />
                    </div>

                    <div className="filter__inputField">
                        <Dropdown 
                            id = "coedDropDown"
                            options={coed__option}
                            placeholder="Select Coed"
                            value = {coed}
                            onChange={coedChange}
                        />
                    </div>
                    
                    <div className="filter__inputField">
                        <Dropdown 
                            id = "leaseTypeDropDown"
                            options={leaseType__option}
                            placeholder="Lease Type"
                            value = {leaseType}
                            onChange={leaseTypeChange}
                        />
                    </div>

                    <Button
                        variant="contained"
                        type="primary"
                        className = "filter__button"
                        onClick  = {searchListing}
                    >
                        Search Listing
                    </Button>

                    <Button
                        variant="contained"
                        type="primary"
                        className = "filter__button"
                        onClick = {resetListing}    
                    >
                        Reset Listing
                    </Button>
                    
                </div>
                <hr id="filter__divider"/>
                <div className="property_map_container">
                    {!noListings ?(
                        <div className="property__container">
                            {property.map((post) => (
                                <BrowseListingInfo 
                                    property = {post}
                                    id = {post.id}
                                />
                            ))}
                        </div>
                    ):(
                        <div className="property__container">
                            <h2>No listings available right now...</h2>
                        </div>
                    )}
                    <div className="map__container">
                        <Maps />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Buyer;
