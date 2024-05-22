import { get } from "@/utils/api";
import { ChevronLeft } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type HeadCountData = {
  location: string;
  device_id: string;
  date_time: string;
  status: string;
};

const Headcount = () => {
  const [data, setData] = React.useState<HeadCountData[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await get("/headcount_table");
        if (response.success !== true) {
          toast.error(response.error);
          return;
        }

        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center m-4">
        <Link to="/" className="flex items-center">
          <div className="flex bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none items-center">
            <ChevronLeft size="24" className="" />
            <button className="">Back</button>
          </div>
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-left">Location</th>
            <th className="py-2 px-4 border-b text-left">DeviceId</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.device_id}
                className="h-10 border-b bg-gray-50 hover:bg-gray-100"
              >
                <td className="py-2 px-4 text-left">{item.location}</td>
                <td className="py-2 px-4 text-left">{item.device_id}</td>
                <td className="py-2 px-4 text-left">{item.date_time}</td>
                <td
                  className="py-2 px-4 text-left"
                  style={{ color: item.status ? "green" : "red" }}
                >
                  {item.status ? "Active" : "Inactive"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Headcount;
