import { useEffect, useState } from "react";
import { fetchCars } from "../api/vehicleAPI";
import usePagination from "../hooks/usePagination";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const { currentData, currentPage, maxPage, next, prev } = usePagination(cars, 6);

  useEffect(() => {
    fetchCars()
      .then(setCars)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (cars.length === 0) return <div>Loading cars...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🚗 Cars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {currentData().map((car) => (
          <div key={car.id} className="border rounded p-4 shadow hover:shadow-lg transition">
            <img
              src={`https://source.unsplash.com/400x300/?${car.car}`}
              alt={car.car}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="font-semibold text-lg">{car.car}</h2>
            <p>Year: {car.car_model_year}</p>
            <p>Color: {car.car_color}</p>
            <p className="text-blue-700 font-semibold">Price: {car.price}</p>
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
        className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50`}
      >
        Prev
      </button>
      <span>
        Page {currentPage} of {maxPage}
      </span>
      <button
        onClick={next}
        disabled={currentPage === maxPage}
        className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50`}
      >
        Next
      </button>
    </div>
  );
}
