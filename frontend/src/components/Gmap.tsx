import { useEffect, useState } from "react";
import { useJsApiLoader, Marker, GoogleMap } from "@react-google-maps/api";
import { get } from "@/utils/api";
import "./map.css";
import { toast } from "react-toastify";

type DateRangeProps = {
  from_date: any;
  to_date: any;
};

type DeviceProps = {
  location: string;
  id: number;
  anpr: string;
  next_device: number;
  latitude: number;
  longitude: number;
  icon: string;
};

type GmapProps = {
  dateRange: DateRangeProps;
  devices: DeviceProps[];
};

const Gmap: React.FC<GmapProps> = ({ dateRange, devices }) => {
  const [deviceSummary, setDeviceSummary] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryPopup, setSummaryPopup] = useState<boolean>(false);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState<number>(7);
  const [deviceSummaryName, setDeviceSummaryName] = useState<any>("");
  const [myMapTypeId, _setMyMapTypeId] = useState<string>("satellite");
  const [_myMap, setMyMap] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB8OQXaMtBsmYUIk7Aoste59ipKJYjCIqs",
  });

  const handleCloseSummary = () => {
    setSummaryPopup(false);
    setDeviceSummary({});
  };

  const handleViewSummary = async (anpr: string) => {
    setSummaryPopup(true);
    setLoading(true);

    const device = devices.find((device) => device.anpr === anpr);
    setDeviceSummaryName(device?.location);

    try {
      const convertedFromDate = dateRange.from_date.date
        .toISOString()
        .split("T")[0];
      const convertedToDate = dateRange.to_date.date
        .toISOString()
        .split("T")[0];

      console.log(convertedFromDate, convertedToDate);

      const response = await get(`/summary?device=${anpr}`, {
        from: convertedFromDate + "T" + dateRange.from_date.time,
        to: convertedToDate + "T" + dateRange.to_date.time,
      });

      const data = await response;
      if (data.success !== true) {
        toast.error(data.error);

        return;
      }
      setDeviceSummary(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setDeviceSummary({});
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    // calculate the center of the map based on the devices ignore the 0 lat long
    const filteredDevices = devices.filter(
      (device) => device.latitude !== 0 && device.longitude !== 0
    );
    const lat = filteredDevices.reduce((acc, curr) => acc + curr.latitude, 0);
    const lng = filteredDevices.reduce((acc, curr) => acc + curr.longitude, 0);
    setPosition({
      lat: lat / filteredDevices.length,
      lng: lng / filteredDevices.length,
    });

    // set the zoom level based distance between the devices
    const latitudes = filteredDevices.map((device) => device.latitude);
    const longitudes = filteredDevices.map((device) => device.longitude);
    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    if (maxDiff < 0.1) {
      console.log("maxDiff1", maxDiff);
      setZoom(14);
    } else if (maxDiff < 0.5) {
      console.log("maxDiff2", maxDiff);
      setZoom(12);
    } else if (maxDiff < 1) {
      console.log("maxDiff3", maxDiff);
      setZoom(10);
    } else if (maxDiff < 2) {
      console.log("maxDiff4", maxDiff);
      setZoom(10);
    }
  }, [devices]);

  return (
    <>
      {isLoaded && (
        <GoogleMap
          id="google-map-script"
          center={position}
          zoom={zoom}
          options={{
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            mapTypeId: myMapTypeId,
          }}
          tilt={0}
          mapContainerStyle={{
            height: "90vh",
            width: "100%",
            cursor: "default",
          }}
          onLoad={(map) => setMyMap(map)}
        >
          <Marker
            position={{ lat: 30.999214, lng: 78.4626951 }}
            icon={{
              url: "temple.png",
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: "Yamunotri",
              className: "label absolute top-3 left-[-25px] text-white",
            }}
          />
          <Marker
            position={{ lat: 30.9943684, lng: 78.9398699 }}
            icon={{
              url: "temple.png",
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: "Gangotri",
              className: "label absolute top-3 left-[-25px] text-white",
            }}
          />
          <Marker
            position={{ lat: 30.7345609, lng: 79.0673204 }}
            icon={{
              url: "temple.png",
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: "Kedarnath",
              className: "label absolute top-3 left-[-25px] text-white",
            }}
          />
          <Marker
            position={{ lat: 30.7423302, lng: 79.4930256 }}
            icon={{
              url: "temple.png",
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: "Badrinath",
              className: "label absolute top-3 left-[-25px] text-white",
            }}
          />

          {devices.map(
            (device) =>
              device.latitude !== 0 &&
              device.longitude !== 0 && (
                <Marker
                  key={device.id}
                  label={{
                    text: device.location,
                    className: "label absolute top-5 left-[-25px] text-white",
                  }}
                  position={{ lat: device.latitude, lng: device.longitude }}
                  onMouseOver={() => handleViewSummary(device.anpr)}
                />
              )
          )}
        </GoogleMap>
      )}
      {summaryPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={handleCloseSummary}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg relative"
            onMouseLeave={handleCloseSummary}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseSummary}
              className="absolute top-3 right-3 bg-transparent border-none text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold">
                Device name: {deviceSummaryName}
              </h2>
              <h2 className="text-lg font-bold">Device Summary</h2>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="mr-4">Registered Plate Count:</p>
                  </div>
                  <div>{deviceSummary.registered_plate_count}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="mr-4">Non-Registered Plate Count:</p>
                  </div>
                  <div>{deviceSummary.non_registered_plate_count}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="mr-4">Total Plate Count:</p>
                  </div>
                  <div>{deviceSummary.total_plate_count}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gmap;
