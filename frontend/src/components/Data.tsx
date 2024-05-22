// Pages.tsx

import React from "react";
import ImageComponent from "./ImageComponent";

interface DataItem {
  id: number;
  plate_number: string;
  plate_type: string;
  vehicle_type: string;
  created_at: string;
  path: string;
  location: string;
}

interface PagesProps {
  data: DataItem[];
}

const Data: React.FC<PagesProps> = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div
          key={item.id}
          className="m-4 bg-gray-200 rounded-lg overflow-hidden shadow-lg max-h-96 max-w-96 min-w-96 min-h-86 flex self-end flex-col"
        >
          <ImageComponent path={item.path} />
          <div className="flex-initial bg-white p-4">
            <p>
              <b>Plate Number: </b>
              {item.plate_number}
            </p>
            <p>
              <b>Vehicle Type: </b>
              {item.vehicle_type}
            </p>
            <p>
              <b>Time: </b>
              {item.created_at}
            </p>
            <p>
              <b>Location: </b>
              {item.location}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Data;
