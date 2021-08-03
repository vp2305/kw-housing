import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import "./Seller.css";
import { Button } from "@material-ui/core";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { storage } from "./firebase";
import db from "./firebase";
import Geocode from "react-geocode";
import { useHistory } from 'react-router';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// NEED TO CHECK FOR REQUIRED ONCE CLICKED OR NOT...
// That will be done in the next iteration...

function Seller() {
  const history = useHistory();
  // Property Attributes
  // Location Information
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  // Listing Details
  const [listingTitle, setListingTitle] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [buildingType, setBuildingType] = useState('');
  // Rental Agreement Details
  const [fromDate, setFromDate] = useState(0);
  const [rentDuration, setRentDuration] = useState(0);
  const [leaseType, setLeaseType] = useState('');
  const [genderSpecification, setGenderSpecification] = useState('');
  //Price Details
  const [pricePerMonth, setPricePerMonth] = useState(0);
  const [utilityPricePerMonth, setUtilityPricePerMonth] = useState(0);
  // Media posting and its condition handling
  const [previewImageState] = useState([]);
  const [current, setCurrent] = useState(0);
  const [length, setLength] = useState(0);
  const [showImageDiv, setShowImageDiv] = useState(false);
  const [finalImageState] = useState([]);
  const [imageURLS] = useState([]);
  const [{ user }] = useStateValue();

  const [rentDisableStatus, setRentDisableStatus] = useState(true);

  Geocode.setApiKey("AIzaSyDkBnNjsz_3xo2YC6M3Dygcf8kWFZzqm9w");
  Geocode.setLanguage("en");
  Geocode.setRegion("ca");

  const buildingType_option = [
    'Apartment/Condo', 'Detached House', 'Townhouse'
  ];

  const leaseType__option = [
    '4 Month Sublet', '8 Month Sublet', 'Lease'
  ];

  const coed__option = [
    'Coed', 'Female Only', 'Male Only'
  ];

  const buildingTypeChange = (e) => {
    setBuildingType(e.value);
  }

  const leaseTypeChange = (e) => {
    setLeaseType(e.value);
    if (e.value === 'Lease'){
      setRentDisableStatus(false);
    } else {
      setRentDisableStatus(true);
      document.getElementById("rentDurationInput").value = "";
      setRentDuration("");
    }
  }

  const coedTypeChange = (e) => {
    setGenderSpecification(e.value);
  }

  useEffect(() => {
      if (length !== 0){
          alert('You have successfully uploaded ' + length + ' pictures');
      } else {
          setShowImageDiv(false);
      }
  }, [length]);



  const nexSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const previousSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const deleteImage = () => {
    previewImageState.splice(current, 1);
    setLength(previewImageState.length);
    if (current === 0) {
      nexSlide();
    } else {
      previousSlide();
    }
  };

  const onImageChange = (event) => {
    // https://www.youtube.com/watch?v=l1MYfu5YWHc&ab_channel=BrianDesign
    if (event.target.files && event.target.files[0]) {
      if (length <= 10) {
        for (let i = 0; i < event.target.files.length; i++) {
          previewImageState.push(URL.createObjectURL(event.target.files[i]));
          finalImageState.push(event.target.files[i]);
        }
        setLength(previewImageState.length);
        setShowImageDiv(true);
      } else {
        alert(
          "You have successfully uploaded 10 pictures already, you can't provide more then 10 pictures!"
        );
      }
    }
  };

  const checkedBox = (event) => {
    // Handling all the features like adding or removing items based on the user input.
    var currentCheckedName = event.target.name;
    if (features.includes(currentCheckedName)) {
      features.splice(features.indexOf(currentCheckedName), 1);
    } else {
      features.push(currentCheckedName);
    }
  };

  const postListing = (event) => {
    event.preventDefault();
    alert("Please wait while your listing is posted!");
    getLat_lng(address);
  };

  const getLat_lng = (address) => {
    // Getting lat and lng based on the address
    Geocode.fromAddress(address).then(
        (response) => {
        //   const { lat, lng } = response.results[0].geometry.location;
        //   setLatitude(response.results[0].geometry.location.lat);
        //   setLongitude(response.results[0].geometry.location.lng);
            // Call handle upload function for uploading to the database with the correct lat and lng.
          handleUpload(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);
        },
        (error) => {
          console.error(error);
        }
        
    );
  };

  const handleUpload = (lat, lng) => {
    let counter = 0;
    finalImageState.map((images)=>{
        const uploadTask = storage.ref(`images/${images.name}`).put(images)
        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                // progress function ...
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                .ref("images")
                .child(images.name)
                .getDownloadURL()
                // ^ this will go get the download link
                .then(url => {
                    counter = counter + 1;
                    imageURLS.push(url);            
                    console.log("Counter : " + counter);   
                    console.log(length);
                    if (counter === length) {
                        // Uploading the property to all the available property tab.
                        const docAvailableProperty = db.collection('availableProperty').doc();
                        docAvailableProperty.set({
                            address: address,
                            city: city,
                            unitNumber: unitNumber, 
                            zipCode: zipCode,
                            listingTitle: listingTitle,
                            bedrooms: bedrooms,
                            bathrooms: bathrooms,
                            description: description,
                            buildingType: buildingType,
                            fromDate: fromDate,
                            rentDuration: rentDuration,
                            leaseType: leaseType,
                            genderSpecification: genderSpecification,
                            pricePerMonth: pricePerMonth,
                            utilityPricePerMonth: utilityPricePerMonth,
                            sellerUID: user?.uid,
                            sellerName: user?.displayName,
                            features: features,
                            imageURLS: imageURLS,
                            latitude: lat,
                            longitude: lng,
                        });

                        // Uploading the property to the user tab for my postings tab.
                        db.collection("users").doc(user?.uid).collection("userSellingProperty").doc(docAvailableProperty.id).set({
                            address: address,
                            city: city,
                            unitNumber: unitNumber, 
                            zipCode: zipCode,
                            listingTitle: listingTitle,
                            bedrooms: bedrooms,
                            bathrooms: bathrooms,
                            description: description,
                            buildingType: buildingType,
                            fromDate: fromDate,
                            rentDuration: rentDuration,
                            leaseType: leaseType,
                            genderSpecification: genderSpecification,
                            pricePerMonth: pricePerMonth,
                            utilityPricePerMonth: utilityPricePerMonth,
                            sellerUID: user?.uid,
                            sellerName: user?.displayName,
                            features: features,
                            imageURLS: imageURLS,
                            latitude: lat,
                            longitude: lng,
                        });
                        history.push("/my-postings");
                    }
                });
            }   
        );
    })
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
              <div className={showImageDiv ? 'media__preview' : 'media__previewHide'}>
                  <FaArrowAltCircleLeft className="left-arrow" 
                  onClick={previousSlide} />
                  <FaArrowAltCircleRight className="right-arrow" onClick={nexSlide} />
                  <MdDelete className="delete-icon" onClick={deleteImage}/>
                  {previewImageState.map((slide, index) => {
                      return (
                          <div className={index === current ? 'slide active' : 'slide'} key={index}>
                              {index === current && (
                                  <img src={slide} alt='travel image' className="image" />
                              )}
                          </div>
                      )
                  })}
              </div>
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
                  onChange={(e) => setBedrooms(e.target.value)}
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
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </div>
              <div id="sellerFormInfoFlex">
                <label>Building Type</label>
                
                <div className="inputFieldFlex__DropDown">
                  <Dropdown 
                    className="dropDown"
                    options={buildingType_option}
                    placeholder="Select One"
                    value = {buildingType}
                    onChange={buildingTypeChange}
                  />
                </div>

              </div>
            </div>
            <div id="formInfo">
              <label id="features">Features</label>
              <div className="feature__form">
                <div className="feature__column">
                  <span>
                    <input
                      type="checkbox"
                      name="Laundry (In Unit)"
                      onChange={checkedBox}
                    />
                    <label for="Laundry (In Unit)">Laundry (In Unit)</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Balcony"
                      onChange={checkedBox}
                    />
                    <label for="Balcony">Balcony</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Air Conditioning"
                      onChange={checkedBox}
                    />
                    <label for="Air Conditioning">Air Conditioning</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Smoke Free"
                      id="3"
                      onChange={checkedBox}
                    />
                    <label for="Smoke Free">Smoke Free</label>
                  </span>
                </div>
                <div className="feature__column">
                  <span>
                    <input
                      type="checkbox"
                      name="Laundry (in Building)"
                      onChange={checkedBox}
                    />
                    <label for="Laundry (in Building)">
                      Laundry (in Building)
                    </label>
                  </span>
                  <span>
                    <input type="checkbox" name="Yard" onChange={checkedBox} />
                    <label for="Yard">Yard</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Utilities Included"
                      onChange={checkedBox}
                    />
                    <label for="Utilities Included">Utilities Included</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Accessibility Features"
                      onChange={checkedBox}
                    />
                    <label for="Accessibility Features">
                      Accessibility Features
                    </label>
                  </span>
                </div>
                <div className="feature__column">
                  <span>
                    <input type="checkbox" name="TV" onChange={checkedBox} />
                    <label for="TV">TV</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Pet Friendly"
                      onChange={checkedBox}
                    />
                    <label for="Pet Friendly">Pet Friendly</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Dishwasher"
                      onChange={checkedBox}
                    />
                    <label for="Dishwasher">Dishwasher</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Outdoor Smoking"
                      onChange={checkedBox}
                    />
                    <label for="Outdoor Smoking">Outdoor Smoking</label>
                  </span>
                </div>
                <div className="feature__column">
                  <span>
                    <input
                      type="checkbox"
                      name="Parking Included"
                      onChange={checkedBox}
                    />
                    <label for="Parking Included">Parking Included</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Fridge/Freezer"
                      onChange={checkedBox}
                    />
                    <label for="Fridge/Freezer">Fridge/Freezer</label>
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      name="Furnished"
                      onChange={checkedBox}
                    />
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
                onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div id="sellerFormInfoFlex">
                <label>Lease Type</label>
                
                <div className="inputFieldFlex__DropDown">
                  <Dropdown 
                    className="dropDown"
                    options={leaseType__option}
                    placeholder="Select One"
                    value = {leaseType}
                    onChange={leaseTypeChange}
                  />
                </div>
              </div>
              <div id="sellerFormInfoFlex">
                <label>Rent Duration (Month)</label>
                <input
                  disabled = {rentDisableStatus}
                  type="number"
                  className="seller__inputFieldFlex"
                  placeholder="0"
                  min="0"
                  max="200"
                  id = "rentDurationInput"
                  onChange={(e) => setRentDuration(e.target.value + " Months")}
                />
              </div>
            </div>
            <div id="formInfo">
              <label>Gender Specification</label>
              
              <div className="inputFieldFlex__Coed">
                  <Dropdown 
                    className="dropDown"
                    options={coed__option}
                    placeholder="Select One"
                    value = {genderSpecification}
                    onChange={coedTypeChange}
                  />
                </div>
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
                  min="100"
                  max="10000"
                  onChange={(e) => setPricePerMonth(e.target.value)}
                />
              </div>
              <div id="sellerFormInfoFlex">
                <label>Estimated Utility Price/Month $</label>
                <input
                  type="number"
                  className="seller__inputFieldFlex"
                  placeholder="0"
                  min="0"
                  max="1000"
                  onChange={(e) => setUtilityPricePerMonth(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="submitFormContainer">
            <Button
              variant="contained"
              type="primary"
              className="postButton"
              onClick={postListing}
            >
              Post Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Seller;
