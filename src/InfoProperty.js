import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { useHistory } from 'react-router';
import db from './firebase';
import "./InfoProperty.css";
import { useStateValue } from './StateProvider';

function InfoProperty({property, id, myPosting, favorite}) {
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(0);
    const history = useHistory();
    const [{user}] = useStateValue();

    useEffect(() => {
        setImages(property.data.imageURLS)
    },[property])

    useEffect(() => {
        setLength(images.length);
    },[images])
    
    const nexSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }

    const previousSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    function viewListing(id) {
        console.log(id);
        history.push('/postings-view/' + id);
    }

    function deleteListing(id) {
        db
        .collection('availableProperty')
        .doc(id)
        .delete();

        db
        .collection('users')
        .doc(user?.uid)
        .collection('userSellingProperty')
        .doc(id)
        .delete();
    }

    return (
        <div className="infoProperty">
            <div className="flex__InfoLeft">
                <div className="infoPropertyMedia__container">
                    <FaArrowAltCircleLeft className="left-arrow" 
                        onClick={previousSlide} />
                    <FaArrowAltCircleRight className="right-arrow" onClick={nexSlide} />
                    <div className="infoProperty_imageContainer">
                        {images.map((url, index) => {
                            return (
                                <div className={index === current ? 'slide active' : 'slide'} key={index}>
                                    {index === current && (
                                        <img src={url} alt='travel image' className="infoProperty__image" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex__InfoRight">
                <h2>{property.data.address}</h2>
                <h4>${property.data.pricePerMonth} / Month</h4>
                <span className = "browsePost__featureView">
                    <span className="span__title">
                        <img src="https://img.icons8.com/ios-glyphs/30/000000/bedroom.png" alt = "bedroom icon" className="browsePost__imageIcon" />
                        <span className="span__info">
                            <h4>Bedrooms:</h4>
                            <h4 id = "span__ans">{property.data.bedrooms}</h4>
                        </span>
                    </span>
                    <span className="span__title2">
                        <img  src="https://img.icons8.com/material-sharp/30/000000/bath.png" alt = "bath icon" className="browsePost__imageIcon"/>
                        <span className="span__info">
                            <h4>Washrooms:</h4>
                            <h4 id = "span__ans">{property.data.bathrooms}</h4>
                        </span>
                    </span>
                </span>
                <span className = "browsePost__featureView2">
                    <span className="span__title">
                        <img src="https://img.icons8.com/ios/28/000000/gender.png" alt = "bedroom icon" className="browsePost__imageIcon" />
                        <span className="span__info">
                            <h4>Coed:</h4>
                            <h4 id = "span__ans">{property.data.genderSpecification}</h4>
                        </span>
                    </span>
                    <span className="span__title2">
                        <img  src="https://img.icons8.com/windows/28/000000/calendar.png" alt = "bath icon" className="browsePost__imageIcon"/>
                        <span className="span__info">
                            <h4>Start Date:</h4>
                            <h4 id = "span__ans">{property.data.fromDate}</h4>
                        </span>
                    </span>
                </span>
                <p>{property.data.description}</p>
                {myPosting ?(
                    <div className = "button__container">
                       <Button variant="contained" type="primary" onClick={()=> viewListing(property.id)}>View</Button>
                       <Button variant="contained" type="primary" onClick={()=> deleteListing(property.id)}>Delete</Button>
                    </div>
                ):(
                    <div className = "button__container">
                       <Button variant="contained" type="primary" onClick={()=> viewListing(property.id)}>View</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InfoProperty;
