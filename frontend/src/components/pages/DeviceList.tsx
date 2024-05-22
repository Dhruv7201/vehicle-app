import { useEffect, useState } from "react";
import { get } from "@/utils/api";
import DateRange from "@/utils/DateRange";
import { toast } from "react-toastify";

type Device = {
  id: number;
  location: string;
  anpr: string;
};

type DeviceSummary = {
  success: boolean;
  registered_plate_count: number;
  non_registered_plate_count: number;
  total_plate_count: number;
};

type DateConstructor = {
  date: Date;
  time: string;
};

const DeviceList = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceSummary, setDeviceSummary] = useState<DeviceSummary | null>(
    null
  );
  const [summaryPopup, setSummaryPopup] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [from_date, setFrom] = useState<DateConstructor>({
    date: new Date(),
    time: new Date().toLocaleTimeString().slice(0, 5),
  });
  const [to_date, setTo] = useState<DateConstructor>({
    date: new Date(),
    time: new Date().toLocaleTimeString().slice(0, 5),
  });

  useEffect(() => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    setFrom({
      date: twoDaysAgo,
      time: new Date().toLocaleTimeString().slice(0, 5),
    });

    setTo({
      date: new Date(),
      time: new Date().toLocaleTimeString().slice(0, 5),
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await get("/devices");
        const res = response;
        if (res.success !== true) {
          toast.error(res.error);
        }
        setDevices(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewSummary = async (
    anpr: string,
    from_date: DateConstructor,
    to_date: DateConstructor
  ) => {
    setSummaryPopup(true);
    try {
      console.log(from_date, to_date);

      const convertedFromDate = from_date.date.toISOString().split("T")[0];
      const convertedToDate = to_date.date.toISOString().split("T")[0];

      const response = await get(`/summary?device=${anpr}`, {
        from: convertedFromDate + "T" + from_date.time,
        to: convertedToDate + "T" + to_date.time,
      });
      const res = response;
      if (res.success !== true) {
        toast.error(res.error);
      }
      setDeviceSummary(res);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleCloseSummary = () => {
    setSummaryPopup(false);
    setDeviceSummary(null);
  };

  return (
    <>
      <div className="bg-gray-100 p-4 min-h-screen">
        <h1 className="text-2xl font-bold">Device List</h1>
        <DateRange
          setFrom={setFrom}
          setTo={setTo}
          from_date={from_date}
          to_date={to_date}
        />
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    <b>Location: </b>
                    {device.location}
                  </p>
                </div>
                <div>
                  <button
                    className={`bg-blue-500 text-white py-2 px-4 rounded-lg`}
                    onClick={() =>
                      handleViewSummary(device.anpr, from_date, to_date)
                    }
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {summaryPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Device Summary</h2>
            {deviceSummary ? (
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
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
                  onClick={handleCloseSummary}
                >
                  Close
                </button>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceList;
