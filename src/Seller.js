import React, { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import "./Seller.css";
import { Avatar, Button, IconButton } from '@material-ui/core';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';

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
    const [rentalTerms, setRentalTerms] = useState('');
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

    const [mydata, setData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(0);
    const [showImageDiv, setShowImageDiv] = useState(false);

    const nexSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }

    const previousSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    useEffect(() => {
        console.log(length);
        if (length !== 0){
            alert('You have successfully uploaded ' + length + ' pictures');
        }
    }, [length]);



    const onImageChange = (event) => {
        // https://www.youtube.com/watch?v=l1MYfu5YWHc&ab_channel=BrianDesign
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            console.log(event.target.files);
            if (length <= 10) {
                for (let i = 0; i < event.target.files.length; i++) {
                    mydata.push({
                        image: URL.createObjectURL(event.target.files[i]),
                        number: event.target.files.length
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
                                {mydata.map((slide, index) => {
                                    return (
                                        <div className={index === current ? 'slide active' : 'slide'} key={index}>
                                            {index === current && (<img src={slide.image} alt='travel image' className="image" />)}
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
                            />
                        </div>
                        <div id="formInfo">
                            <label>Address</label>
                            <input
                                type="text"
                                className="seller__inputField"
                                placeholder="Enter the address"
                            />
                        </div>
                        <div className="flex__form">
                            <div id="sellerFormInfoFlex">
                                <label>Unit Number</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Eg. 150"
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>City Name</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Eg. Kitchener"
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Eg. N2A"
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
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Building Type</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Drop down"
                                />
                            </div>
                        </div>
                        <div id="formInfo">
                            <label id="features">Features</label>
                            <div className="feature__form">
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="Laundry (In Unit)" />
                                        <label for="Laundry (In Unit)">Laundry (In Unit)</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Balcony" />
                                        <label for="Balcony">Balcony</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Air Conditioning" />
                                        <label for="Air Conditioning">Air Conditioning</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Smoke Free" />
                                        <label for="Smoke Free">Smoke Free</label>
                                    </span>
                                </div>
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="Laundry (in Building)" />
                                        <label for="Laundry (in Building)">Laundry (in Building)</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Yard" />
                                        <label for="Yard">Yard</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Utilities Included" />
                                        <label for="Utilities Included">Utilities Included</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Accessibility Features" />
                                        <label for="Accessibility Features">Accessibility Features</label>
                                    </span>
                                </div>
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="TV" />
                                        <label for="TV">TV</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Pet Friendly" />
                                        <label for="Pet Friendly">Pet Friendly</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Dishwasher" />
                                        <label for="Dishwasher">Dishwasher</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Outdoor Smoking" />
                                        <label for="Outdoor Smoking">Outdoor Smoking</label>
                                    </span>
                                </div>
                                <div className="feature__column">
                                    <span>
                                        <input type="checkbox" name="Parking Included" />
                                        <label for="Parking Included">Parking Included</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Fridge/Freezer" />
                                        <label for="Fridge/Freezer">Fridge/Freezer</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name="Furnished" />
                                        <label for="Furnished">Furnished</label>
                                    </span>
                                    <span>
                                        <Button id="clearAllButton">Clear All</Button>
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
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Lease Type</label>
                                <input
                                    type="text"
                                    className="seller__inputFieldFlex"
                                    placeholder="Drop Down"
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
                            />
                        </div>
                    </div>
                    <div className="price__Details">
                        <h2>Price Details</h2>
                        <div className="flex__form">
                            <div id="sellerFormInfoFlex">
                                <label>Price/Month</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="10000"
                                />
                            </div>
                            <div id="sellerFormInfoFlex">
                                <label>Rent/Month</label>
                                <input
                                    type="number"
                                    className="seller__inputFieldFlex"
                                    placeholder="0"
                                    min="0"
                                    max="10000"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="submitFormContainer">
                        <Button variant="contained" type='primary' className="postButton">Post Listing</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Seller;
