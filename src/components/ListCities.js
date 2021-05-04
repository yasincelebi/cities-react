import React, { useEffect, useState } from "react";
import Data from "../cities.json";
import Map from "./Map";
import * as geolib from "geolib";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
const ListCities = () => {
  const [county, setCounty] = useState([]);
  const [locat, setLocat] = useState({});
  const [marker, setMarker] = useState({});
  const [here, setHere] = useState({});
  const [distance, setDistance] = useState(
    "Please Double Click To See Distance"
  );
  const [choose, setChoose] = useState([39.92077, 32.85411]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [nearest, setNearest] = useState([]);
  const [size, setSize] = useState(3);
  const getCities = Data.map((arg) => {
    return arg.city;
  });
  // remove duplicate cities - ES6
  const filtered = [...new Set(getCities)];
  const filterCounties = (city) => {
    setCounty([]);
    let a = Data.filter((y) => y.city === city);
    let filteredCounties = a.map((y) => setCounty((a) => [...a, y.county]));

    return filteredCounties;
  };
  const handleCounty = (e) => {
    let counties = Data.filter((i) => i.county === e.target.value);
    setLocat({ lat: counties[0].centerLat, lng: counties[0].centerLon });
    console.log(locat);
    setHere({ city: counties[0].city, county: counties[0].county });

    setDisabledButton(false);
  };
  const handleClick = (event) => {
    /* automatic incoming is selected */
    handleCounty(event);
    return filterCounties(event.target.value);
  };
  // https://www.movable-type.co.uk/scripts/latlong.html
  const getDistance = (lat1, lat2, lon1, lon2) => {
    setDistance();
    lat1 = marker.lat;
    lat2 = choose[0];
    lon1 = marker.lon;
    lon2 = choose[1];
    console.log(lat1, lat2, lon1, lon2);
    const toRadian = (arg) => {
      return (arg * Math.PI) / 180;
    };
    const R = 6371e3; // metres
    const φ1 = toRadian(lat1); // φ, λ in radians
    const φ2 = toRadian(lat2);
    const Δφ = toRadian(lat2 - lat1);
    const Δλ = toRadian(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    const meterToKm = d / 1000;
    setDistance(Math.floor(meterToKm));
  };
  const getNearest = (e) => {
    e.preventDefault();
    setChoose([
      parseInt(e.target.form[0].value),
      parseInt(e.target.form[1].value),
    ]);
    const u = Data.map((e) => ({
      lat: e.centerLat,
      lon: e.centerLon,
      county: e.county,
    }));
    /* https://github.com/manuelbieh/geolib#orderbydistancepoint-arrayofpoints */
    const a = geolib.orderByDistance({ lat: choose[0], lon: choose[1] }, u);
    const items = a.slice(0, size);
    setNearest(items);
    console.log(nearest);
  };
  const changeMarker = (e) => {
    setMarker({
      lat: parseFloat(e.target.attributes.lat.value),
      lon: parseFloat(e.target.attributes.lon.value),
    });
    getDistance(marker);
    console.log(marker);
  };
  return (
    <>
      <div className="selects">
        <select onChange={handleClick} className="select city">
          <option>İl Seçiniz</option>
          {filtered.map((i, s) => (
            <option data-city={i} key={s}>
              {" "}
              {i}
            </option>
          ))}
        </select>
        <select onChange={handleCounty} className="select county">
          <option disabled>İlçe Seçiniz</option>
          {county.map((y, index) => (
            <option data-county={y} key={index}>
              {" "}
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="distance">
        {!isNaN(distance && distance.length > 1) ? (
          <div className="distance">{distance} km </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <form className="form">
        <div className="inputs">
          <input
            className="lat input"
            placeholder="Latitude"
            onChange={getNearest}
          />
          <input
            className="lon input"
            placeholder="Longitude"
            onChange={getNearest}
          />
        </div>
        <div className="button">
          <button onClick={getNearest}>Get the nearest</button>
        </div>
      </form>
      <div className="distances">
        {nearest.map((item, index) => (
          <div key={index} onClick={changeMarker} lat={item.lat} lon={item.lon}>
            {item.county}
          </div>
        ))}
      </div>
      <Map
        locati={{ locat }}
        here={here}
        disabledButton={disabledButton}
        lat={choose[0]}
        lon={choose[1]}
        marker={marker}
        choose={choose}
      />
    </>
  );
};

export default ListCities;
