import { useEffect, useState } from "react";
import { fetchBikes } from "../api/vehicleAPI";
import usePagination from "../hooks/usePagination";

export default function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState(null);
  const { currentData, currentPage, maxPage, next, prev } = usePagination(bikes, 6);

  useEffect(() => {
    fetchBikes()
      .then(setBikes)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (bikes.length === 0) return <div>Loading bikes...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🚲 Bike-sharing Networks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {currentData().map((network) => (
          <div key={network.id} className="border rounded p-4 shadow hover:shadow-lg transition">
            <h2 className="font-semibold text-lg">{network.name}</h2>
            <p>City: {network.location.city}</p>
            <p>Country: {network.location.country}</p>
            <a
              href={`https://api.citybik.es${network.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              More Info
            </a>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} maxPage={maxPage} next={next} prev={prev} />
    </div>
  );
}

function Pagination({ currentPage, maxPage, next, prev }) {
  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={prev}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
      >
        Prev
      </button>
      <span>
        Page {currentPage} of {maxPage}
      </span>
      <button
        onClick={next}
        disabled={currentPage === maxPage}
        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
