import React, { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import "./Seller.css";
import { Avatar, Button, IconButton } from '@material-ui/core';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import {MdDelete} from 'react-icons/md';
function Seller() {
    // Property Attributes
    // Location Information
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    // Listing Details
    const [listingTitle, setListingTitle] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState([]);
    const [buildingType, setBuildingType] = useState('');
    // Rental Agreement Details
    const [fromDate, setFromDate] = useState('');
    const [rentDuration, setRentDuration] = useState('');
    const [leaseType, setLeaseType] = useState('');
    const [genderSpecification, setGenderSpecification] = useState('');
    //Price Details
    const [pricePerMonth, setPricePerMonth] = useState('');
    const [utilityPricePerMonth, setUtilityPricePerMonth] = useState('');
    // Media
    const [media, setMedia] = useState();


    // A way to connect the property to the seller
    const [sellerUID, setSellerUID] = useState('');
    const [sellerName, setSellerName] = useState('');
    // Additional info about the place (stored in database) that will help us later on for placing markers
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [{ user }] = useStateValue();
    
    // posting user image and its condition handling
    const [mydata, setData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(0);
    const [showImageDiv, setShowImageDiv] = useState(false);

    useEffect(() => {
        console.log(length);
        if (length !== 0){
            alert('You have successfully uploaded ' + length + ' pictures');
        }
    }, [length]);


    const nexSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }
   

    const previousSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    const deleteImage = () => {


        mydata.splice(current, 1)
        setLength(mydata.length);
    
        if (current === 0){
            nexSlide();
        } else {
            previousSlide();
        }
       
    }



    const onImageChange = (event) => {
        // https://www.youtube.com/watch?v=l1MYfu5YWHc&ab_channel=BrianDesign
        
        if (event.target.files && event.target.files[0]) {
            console.log(event.target.files);
            if (length <= 10) {
                for (let i = 0; i < event.target.files.length; i++) {
                    mydata.push({
                        image: URL.createObjectURL(event.target.files[i]),
                        index: i,
                        name: event.target.files[i].name
                    });
                    console.log(mydata);
                }
                setLength(mydata.length)
                setShowImageDiv(true);
            } else { 
                alert("You have successfully uploaded 10 pictures already, you can't provide more then 10 pictures!");
            }

        }
    }

    const checkedBox = (event) => {
        console.log(features);
        var currentCheckedName = event.target.name;
        if (features.includes(currentCheckedName)) {
            features.splice(features.indexOf(currentCheckedName), 1)
        } else {
            features.push(currentCheckedName)
        }
        console.log(features);
    }



    const postListing = (event) => {
        event.preventDefault();
        console.log("Address: " + address);
        console.log("City: " + city);
        console.log("Unit Number: " + unitNumber);
        console.log("zipCode: " + zipCode);
        console.log("listingTitle: " + listingTitle);
        console.log("bedrooms: " + bedrooms);
        console.log("bathrooms: " + bathrooms);
        console.log("description: " + description);
        console.log("buildingType: " + buildingType);
        console.log("fromDate: " + fromDate);
        console.log("rentDuration: " + rentDuration);
        console.log("leaseType: " + leaseType);
        console.log("genderSpecification: " + genderSpecification);
        console.log("pricePerMonth: " + pricePerMonth);
        console.log("utilityPricePerMonth: " + utilityPricePerMonth);
    }

    return (
        <div className="seller">
            <div className="seller__wrapper">
                <h2>New Posting</h2>
                <hr />
                <form className="newPostingForm">
                    <div className="media">
                        <h2>Photos</h2>
                        <div id="formInfoMedia">
                            <label className="custom-file-upload">
                                <input
                                    type="file"
                                    className="seller__inputFieldFlex"
                                    name="media"
                                    accept="image/*"
                                    multiple
                                    onChange={onImageChange}
                                />
                                <p>Click to upload up to 10 images of your listing</p>
                            </label>
                            <div className={showImageDiv ? 'media__preview' : 'media__previewHide'}>
                                <FaArrowAltCircleLeft className="left-arrow" onClick={previousSlide} />
                                <FaArrowAltCircleRight className="right-arrow" onClick={nexSlide} />
                                <MdDelete className="delete-icon" onClick={deleteImage}/>
                                {mydata.map((slide, index) => {
                                    return (
                                        <div className={index === current ? 'slide active' : 'slide'} key={index}>
                                            {index === current && (
                                                <img src={slide.image} alt='travel image' className="image" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="listing__Details">
                        <h2>Listing Details</h2>
                        <div id="formInfo">
                            <label>Listing Title (Max 60 Characters)</label>
                            <input
                                type="text"
                                className="seller__inputField"
                                placeholder="Eg. Well furnished 2 bedroom apartment"
                                onChange={e => setListingTitle(e.target.value)}
                            />
                        </div>
                        <div id="formInfo">
                            <label>Address</label>
                            <input
                                type="text"
                                className="seller__inputField"
                                placeholder="Enter the address"
                                onChange={e => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="flex__form">
                            <div id="sellerFormInfoFlex">
                                <label>Unit Number</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Eg. 150"
                                    onChange = {e => setUnitNumber(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>City Name</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Eg. Kitchener"
                                    onChange={e => setCity(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Eg. N2A"
                                    onChange={e => setZipCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex__form">
                            <div id="sellerFormInfoFlex">
                                <label>Bedrooms</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="10"
                                    onChange={e => setBedrooms(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Bathrooms</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="10"
                                    onChange={e => setBathrooms(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Building Type</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Drop down"
                                    onChange={e => setBuildingType(e.target.value)}
                                />
                            </div>
                        </div>
                        <div id="formInfo">
                            <label id="features">Features</label>
                            <div className="feature__form">
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="Laundry (In Unit)" onChange={checkedBox}/>
                                        <label for="Laundry (In Unit)">Laundry (In Unit)</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Balcony" onChange={checkedBox}/>
                                        <label for="Balcony">Balcony</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Air Conditioning" onChange={checkedBox}/>
                                        <label for="Air Conditioning">Air Conditioning</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Smoke Free" id="3" onChange={checkedBox}/>
                                        <label for="Smoke Free">Smoke Free</label>
                                    </span>
                                </div>
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="Laundry (in Building)" onChange={checkedBox} />
                                        <label for="Laundry (in Building)">Laundry (in Building)</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Yard" onChange={checkedBox}/>
                                        <label for="Yard">Yard</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Utilities Included" onChange={checkedBox}/>
                                        <label for="Utilities Included">Utilities Included</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Accessibility Features" onChange={checkedBox}/>
                                        <label for="Accessibility Features">Accessibility Features</label>
                                    </span>
                                </div>
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="TV" onChange={checkedBox}/>
                                        <label for="TV">TV</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Pet Friendly" onChange={checkedBox}/>
                                        <label for="Pet Friendly">Pet Friendly</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Dishwasher" onChange={checkedBox}/>
                                        <label for="Dishwasher">Dishwasher</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Outdoor Smoking" onChange={checkedBox}/>
                                        <label for="Outdoor Smoking">Outdoor Smoking</label>
                                    </span>
                                </div>
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="Parking Included" onChange={checkedBox}/>
                                        <label for="Parking Included">Parking Included</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Fridge/Freezer" onChange={checkedBox}/>
                                        <label for="Fridge/Freezer">Fridge/Freezer</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Furnished" onChange={checkedBox}/>
                                        <label for="Furnished">Furnished</label>
                                    </span>
                                   
                                </div>
                            </div>
                        </div>
                        <div id="formInfo">
                            <label>Description</label>
                            <textarea
                                className="description"
                                type="text"
                                spellcheck="true"
                                placeholder="Tell us more about your unit/property (Max 5000 characters)"
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="rental__Details">
                        <h2>Rental Details</h2>
                        <div className="flex__form">
                            <div id="sellerFormInfoFlex">
                                <label>From Date</label>
                                <input
                                    type="date"
                                    className="seller__inputFieldFlex"
                                    required
                                    onChange={e => setFromDate(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Lease Type</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Drop Down"
                                    onChange={e => setLeaseType(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Rent Duration (Month)</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="200"
                                    onChange={e => setRentDuration(e.target.value)}
                                />
                            </div>
                        </div>
                        <div id="formInfo">
                            <label>Gender Specification</label>
                            <input
                                type="text"
                                className="seller__inputFieldFlex"
                                id="genderSpecific"
                                placeholder="Drop Down"
                                onChange={e => setGenderSpecification(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="price__Details">
                        <h2>Price Details</h2>
                        <div className="flex__form">
                            <div id="sellerFormInfoFlex">
                                <label>Price/Month $</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="10000"
                                    onChange={e => setPricePerMonth(e.target.value)}
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Estimated Utility Price/Month $</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="10000"
                                    onChange={e => setUtilityPricePerMonth(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="submitFormContainer">
                        <Button variant="contained" type='primary' className="postButton" onClick={postListing}>Post Listing</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Seller;
