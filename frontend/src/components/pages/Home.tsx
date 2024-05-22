import React, { useState } from "react";
import "boxicons";
import Data from "../Data";
import { Search } from "lucide-react";
import { post } from "@/utils/api";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

interface DataItem {
  id: number;
  plate_number: string;
  plate_type: string;
  vehicle_type: string;
  created_at: string;
  path: string;
  location: string;
}

type ResponseData = {
  ok: boolean;
  success: boolean;
  data: DataItem[];
  error: string;
};

const Home = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [_error, setError] = useState<Boolean>(false);

  const handleSearch = async () => {
    setData([]);
    setError(false);
    try {
      setLoading(true);
      const response = await post(`/search`, { search: searchValue });
      const res: ResponseData = response;
      console.log(response);

      if (!res.success) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="bg-gray-100 p-4 min-h-screen">
        <div className="search-bar mb-4 flex items-center justify-center">
          <Link to="/" className="mr-2">
            <div className="flex bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none items-center">
              <ChevronLeft size="24" className="" />
              <button className="">Back</button>
            </div>
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="box-border p-2 border-2 border-gray-300 rounded-lg w-1/2 focus:outline-none focus:border-blue-500"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg ml-2 focus:outline-none flex items-center"
            onClick={handleSearch}
          >
            <span className="hidden md:inline">Search</span>
            <Search size="24" className="ml-2" />
          </button>
        </div>

        <div>
          <div></div>
          <div>
            <div className="flex flex-wrap justify-center gap-4">
              <Data data={data} />

              {loading && <p>Loading...</p>}
              {data.length === 0 && !loading && <p>No data found</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
