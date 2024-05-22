import { useEffect, useState } from "react";
import DateRange from "@/utils/DateRange";
import Gmap from "../Gmap";
import { get } from "@/utils/api";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

type Filter = {
  location: string;
  id: number;
  anpr: string;
  next_device: number;
  latitude: number;
  longitude: number;
  icon: string;
};

type DateConstructor = {
  date: Date;
  time: string;
};

type DeviceConstructor = {
  location: string;
  id: number;
  anpr: string;
  next_device: number;
  latitude: number;
  longitude: number;
  icon: string;
};

const MapView = () => {
  const [devices, setDevices] = useState<DeviceConstructor[]>([]);
  const [from_date, setFrom] = useState<DateConstructor>({
    date: new Date(),
    time: "00:00",
  });
  const [to_date, setTo] = useState<DateConstructor>({
    date: new Date(),
    time: new Date().toLocaleTimeString().slice(0, 5),
  });

  const [fromFilterSelected, setFromFilterSelected] =
    useState<DeviceConstructor>({
      location: "",
      id: 0,
      anpr: "",
      next_device: 0,
      latitude: 0,
      longitude: 0,
      icon: "",
    });
  const [toFilterSelected, setToFilterSelected] = useState<DeviceConstructor>({
    location: "",
    id: 0,
    anpr: "",
    next_device: 0,
    latitude: 0,
    longitude: 0,
    icon: "",
  });
  const [filtersData, setFiltersData] = useState<Filter[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await get("/devices");
        if (data.success !== true) {
          toast.error(data.error);
          return;
        }

        setFiltersData(data.data);
        setFromFilterSelected(data.data[0]);
        setToFilterSelected(data.data[0]);
        setDevices(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    setFrom({
      date: new Date(),
      time: "00:00",
    });

    setTo({
      date: new Date(),
      time: new Date().toLocaleTimeString().slice(0, 5),
    });
  }, []);

  const handleFromFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = filtersData.find(
      (filter) => filter.location === e.target.value
    );
    if (selectedFilter) {
      setFromFilterSelected(selectedFilter);
    }
  };

  const handleToFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = filtersData.find(
      (filter) => filter.location === e.target.value
    );
    if (selectedFilter) {
      setToFilterSelected(selectedFilter);
    }
  };

  const handleFilterSubmit = async () => {
    console.log(fromFilterSelected, toFilterSelected);
    const response = await get("/filterDevice", {
      from_device: fromFilterSelected.id,
      to_device: toFilterSelected.id,
    });
    if (response.success !== true) {
      toast.error(response.error);
      return;
    }
    setDevices(response.data);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="bg-gray-100 p-2 flex items-center content-center">
          <Link to="/" className="flex items-center">
            <div className="flex bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none items-center">
              <ChevronLeft size="24" className="" />
              <button className="">Back</button>
            </div>
          </Link>
          <div className="w-1/2">
            <DateRange
              setFrom={setFrom}
              setTo={setTo}
              from_date={from_date}
              to_date={to_date}
            />
          </div>
          <div className="w-1/2 flex justify-center">
            <div className="flex bg-white p-4 border border-gray-300 rounded-md shadow-md align-middle">
              <h1 className="text-lg font-bold pr-4 flex items-center">
                Filter by Location
              </h1>
              <div className="flex flex-row items-center space-x-4">
                <div className="flex flex-col">
                  <label htmlFor="fromFilter" className="text-sm font-medium">
                    From
                  </label>
                  <select
                    id="fromFilter"
                    value={fromFilterSelected.location}
                    onChange={handleFromFilterChange}
                    className="border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm w-32"
                  >
                    {filtersData.map((filter, index) => (
                      <option key={index} value={filter.location}>
                        {filter.location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="toFilter" className="text-sm font-medium">
                    To
                  </label>
                  <select
                    id="toFilter"
                    value={toFilterSelected.location}
                    onChange={handleToFilterChange}
                    className="border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm w-32"
                  >
                    {fromFilterSelected.next_device > 0 && (
                      <option value="All">All</option>
                    )}
                    {filtersData
                      .slice(fromFilterSelected.next_device)
                      .map((filter, index) => (
                        <option key={index} value={filter.location}>
                          {filter.location}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md h-10"
                    onClick={handleFilterSubmit}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Gmap dateRange={{ from_date, to_date }} devices={devices} />
        </div>
      </div>
    </>
  );
};

export default MapView;
