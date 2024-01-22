import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.css";
import { create, list } from "../functions/travel";

const MapContent = () => {
  const [position, setPosition] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    lat: 0,
    lng: 0,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    list()
      .then((res) => setData(res.data))
      .catch((e) => console.log(e));
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        map.flyTo(e.latlng, 12);
        setPosition(e.latlng);
        setFormData({
          ...formData,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return position === null ? null : <Marker position={position}></Marker>;
  };

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.name, e.target.value);
  };

  const handleOnSubmit = (e) => {
    // don't refesh the page when submit
    create(formData)
      .then((res) => {
        console.log(res);
        loadData();
      })
      .catch((err) => console.log(err));
    e.preventDefault();
    console.log(formData);
  };

  console.log(formData);

  const flyto = (lat, lng) => {
    mapRef.current.flyTo([lat, lng], 16);
    console.log(lat, lng);
  };

  return (
    <div className="row">
      <div className="col-md-10">
        <MapContainer
          ref={mapRef}
          center={[14.2062083, 99.372856]}
          zoom={6}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {data
            ? data.map((item, index) => (
                <Marker
                  eventHandlers={{
                    click: () => flyto(item.lat, item.lng),
                    dragend: (e) => console.log(e),
                  }}
                  key={index}
                  position={[item.lat, item.lng]}
                  draggable={true}
                >
                  <Popup>{item.title}</Popup>
                </Marker>
              ))
            : null}
          {/* Event */}
          <LocationMarker />
        </MapContainer>
      </div>
      <div className="col-md-2">
        <h4>New location</h4>
        <form onSubmit={handleOnSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="title"
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Detail
            </label>
            <textarea
              name="detail"
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              onChange={handleOnChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              className="form-control"
              id="exampleFormControlInput1"
              value={formData.lat}
              disabled
              placeholder="latitude"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              className="form-control"
              id="exampleFormControlInput1"
              value={formData.lng}
              disabled
              placeholder="longitude"
            />
          </div>
          <div className="mb-3 d-grid gap-2">
            <button className="btn btn-dark" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapContent;
