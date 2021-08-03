import React, { useEffect, useState } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, InfoWindow } from "react-google-maps";
import Geocode from "react-geocode";
import db from './firebase';
import firebase from "firebase";



// https://www.npmjs.com/package/react-geocode
// https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingResults
// https://developers.google.com/maps/documentation/geocoding/overview

// https://github.com/leighhalliday/google-maps-react-demo/blob/master/src/App.js
// https://www.youtube.com/watch?v=Pf7g32CwX_s&ab_channel=LeighHalliday


function Map() {
   
    return (
        <GoogleMap 
            defaultZoom = {15} 
            defaultCenter = {{lat: 43.77285089999999, lng:-79.2314138}} />
    );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function Maps() {
    return (
        <div style={{width: '100%', height: '100%'}}>
            <WrappedMap 
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDkBnNjsz_3xo2YC6M3Dygcf8kWFZzqm9w`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}

export default Maps;
