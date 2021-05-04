import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import mapStyle from "./MapStyle.json";
const containerStyle = {
  width: "100%",
  height: "500px",
};

function Map({ locati, here, disabledButton, lat, lon, marker, choose }) {
  const [center, setCenter] = useState({ lat: 35.9637, lng: 35.2433 });
  const [mark, setMark] = useState();
  const [coordinates, setCoordinates] = useState({});

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const options = {
    styles: mapStyle,
  };
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  const degistirBakiyim = () => {
    setMark(locati.locat);
    /* setCenter(locati); */
    setCenter(locati.locat);
    setCoordinates({});
  };
  useEffect(() => {
    setCenter({ lat: 39.92077, lng: 32.85411 });
  }, []);
  const deneme = () => {
    setCoordinates({ x: locati.locat.lat, y: locati.locat.lng });
  };
  const { city, county } = here;
  const lineOptions = {
    geodesic: true,
    strokeColor: "#000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  };

  // https://www.movable-type.co.uk/scripts/latlong.html
  return isLoaded ? (
    <>
      <div className="poly">
        <button
          disabled={disabledButton}
          onClick={degistirBakiyim}
          className="btn"
        >
          Show polyline
        </button>
      </div>
      <div className="map">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          onUnmount={onUnmount}
          onload={onLoad}
          options={options}
        >
          <Polyline
            path={[mark, { lat: lat, lng: lon }]}
            options={lineOptions}
          />

          {/* Child components */}

          <Marker position={mark} onClick={deneme} />

          {/* onCloseClick : to reopen the infowindow */}
          {Object.keys(coordinates).length ? (
            <InfoWindow
              position={{ lat: coordinates.x, lng: coordinates.y }}
              onCloseClick={() => {
                setCoordinates({});
              }}
            >
              <h3 className="info">
                <div>Merkez Noktası:</div>
                <div>
                  {coordinates.x} {coordinates.y}
                </div>
                <div>{city}</div>
                <div>{county}</div>
              </h3>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </div>
    </>
  ) : (
    <></>
  );
}

export default React.memo(Map);
