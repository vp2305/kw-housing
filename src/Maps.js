import React, { useEffect, useState } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, InfoWindow } from "react-google-maps";
import { compose, withProps } from "recompose";

// https://www.npmjs.com/package/react-geocode
// https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingResults
// https://developers.google.com/maps/documentation/geocoding/overview
// https://github.com/leighhalliday/google-maps-react-demo/blob/master/src/App.js
// https://www.youtube.com/watch?v=Pf7g32CwX_s&ab_channel=LeighHalliday

// https://tomchentw.github.io/react-google-maps/
// https://developers.google.com/maps/documentation/javascript/examples/marker-remove#maps_marker_remove-javascript
// https://www.aspsnippets.com/Articles/Google-Maps-V3-Delete-Remove-Clear-all-markers.aspx
function Maps({property}) {
    const [selectedAddress, setSelectedAddress] = useState(null);

    const MyMapComponent = compose(withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBGEtMHMNxUVGLVwM73LvOd123hKzinfNQ`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
        withScriptjs,
        withGoogleMap,
    )((props) =>
        <GoogleMap 
            defaultZoom = {17} 
            defaultCenter = {{lat: 43.8762074, lng:-79.00339369999999}} >
            {props.sellingProperty.map(location => (
                <Marker
                    position={{
                        lat: location.data.latitude,
                        lng: location.data.longitude,
                    }}
                    onClick={() => {
                        props.setSelectedAddress(location); 
                    }}
                />
            ))}
            {props.selectedAddress && (
                <InfoWindow
                        onCloseClick={() => {
                            props.setSelectedAddress(null);
                        }}
                        position={{
                            lat: props.selectedAddress.data.latitude,
                            lng: props.selectedAddress.data.longitude
                        }}
                    >
                    <div>
                        <h2>{props.selectedAddress.data.sellerName}</h2>
                        <p>{props.selectedAddress.data.description}</p>
                    </div>
                </InfoWindow>
            )} 
        </GoogleMap>
    );
    
    useEffect(() => {
        const listener = e => {
          if (e.key === "Escape") {
            setSelectedAddress(null);
          }
        };
        window.addEventListener("keydown", listener);
        return () => {
          window.removeEventListener("keydown", listener);
        };
    }, []);

    

    return (
        <div style={{width: '100%', height: '100%'}} >
            <MyMapComponent sellingProperty = {property} selectedAddress = {selectedAddress} setSelectedAddress = {setSelectedAddress} /> 
        </div>
    );
}

export default Maps;
