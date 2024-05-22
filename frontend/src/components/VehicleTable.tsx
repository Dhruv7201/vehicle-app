import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type TableValue = {
  entry_pointer: string;
  passed: boolean;
  passed_time: Date;
};

type VehicleTableProps = {
  plateNumber: string;
};

const VehicleTable: React.FC<VehicleTableProps> = ({ plateNumber }) => {
  const [data, setData] = useState<TableValue[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = import.meta.env.VITE_API_URL + "/table/" + plateNumber;

      try {
        const response = await fetch(url);
        const res = await response.json();
        if (res.success !== true) {
          toast.error(res.error);
          return;
        }
        setData(res.data);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Entry Point</th>
            <th className="px-4 py-2">Passed</th>
            <th className="px-4 py-2">Passed Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 text-center ">
                {item.entry_pointer}
              </td>
              <td
                className={`border px-4 py-2 text-center ${
                  item.passed ? "text-green-500" : "text-red-600"
                }`}
              >
                {item.passed ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2 text-center">
                {item.passed_time.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
