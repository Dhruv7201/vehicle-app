import { Link } from "react-router-dom";

const DashBoard = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              Check for Registered Vehicles
            </h2>
            <Link to="/map">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                View
              </button>
            </Link>
          </div>
        </div>
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              Check for Camera Status
            </h2>
            <Link to="/anpr">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                View
              </button>
            </Link>
          </div>
        </div>
        <div className="card bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              Check for Head Count Status
            </h2>
            <Link to="/headcount">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
