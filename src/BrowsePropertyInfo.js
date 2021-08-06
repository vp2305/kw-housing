import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { useHistory } from 'react-router';
import "./BrowsePropertyInfo.css";

function BrowsePropertyInfo({property, id}) {
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [length, setLength] = useState(0);
    const history = useHistory();
    
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
    
    return (
        <div className="browsePost__Container">
            <div className="browsePost__leftContainer">
                <div className="browsePost_media__preview">
                    <FaArrowAltCircleLeft className="left-arrow" 
                        onClick={previousSlide} />
                    <FaArrowAltCircleRight className="right-arrow" onClick={nexSlide} />
                    {images.map((url, index) => {
                        return (
                            <div className={index === current ? 'slide active' : 'slide'} key={index}>
                                {index === current && (
                                    <img src={url} alt='travel image' className="browsePost-image" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="browsePost__rightContainer" onClick={()=> viewListing(id)}>
                <h2>{property.data.address}</h2>
                <h4>${property.data.pricePerMonth} / Month</h4>
                <span className = "browsePost__featureView">
                    <span className="span__titleBrowse">
                        <img src="https://img.icons8.com/ios-glyphs/30/000000/bedroom.png" alt = "bedroom icon" className="browsePost__imageIcon" />
                        <span className="span__info">
                            <h4>Bedrooms:</h4>
                            <h4 id = "span__ans">{property.data.bedrooms}</h4>
                        </span>
                    </span>
                    <span className="span__title2Browse">
                        <img  src="https://img.icons8.com/material-sharp/30/000000/bath.png" alt = "bath icon" className="browsePost__imageIcon"/>
                        <span className="span__info">
                            <h4>Washrooms:</h4>
                            <h4 id = "span__ans">{property.data.bathrooms}</h4>
                        </span>
                    </span>
                </span>
                <span className = "browsePost__featureView2">
                    <span className="span__titleBrowse">
                        <img src="https://img.icons8.com/ios/28/000000/gender.png" alt = "bedroom icon" className="browsePost__imageIcon" />
                        <span className="span__info">
                            <h4>Coed:</h4>
                            <h4 id = "span__ans">{property.data.genderSpecification}</h4>
                        </span>
                    </span>
                    <span className="span__title2Browse">
                        <img  src="https://img.icons8.com/windows/28/000000/calendar.png" alt = "bath icon" className="browsePost__imageIcon"/>
                        <span className="span__info">
                            <h4>Start Date:</h4>
                            <h4 id = "span__ans">{property.data.fromDate}</h4>
                        </span>
                    </span>
                </span>
                <p>{property.data.description}</p>
            </div>
        </div>
    )
}

export default BrowsePropertyInfo
