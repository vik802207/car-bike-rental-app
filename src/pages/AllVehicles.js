import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AllVehicles.css";

const AllVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filters, setFilters] = useState({
    seater: "",
    location: "",
    fuelType: "",
    startDate: "",
    maxPrice: 15000,
  });
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      const snapshot = await getDocs(collection(db, "vehicles"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(data);
      setFiltered(data);
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    let temp = [...vehicles];

    if (filter !== "all") {
      temp = temp.filter((v) => v.type === filter);
    }

    if (filters.seater) {
      temp = temp.filter((v) => String(v.seater) === filters.seater);
    }

    if (filters.location) {
      temp = temp.filter((v) =>
        v.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.fuelType) {
      temp = temp.filter((v) => v.fuelType === filters.fuelType);
    }

    if (filters.startDate) {
      temp = temp.filter(
        (v) => !v.startDate || new Date(v.startDate) <= new Date(filters.startDate)
      );
    }

    if (filters.maxPrice) {
      temp = temp.filter((v) => v.pricePerDay <= filters.maxPrice);
    }

    if (sort === "lowest") {
      temp.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sort === "highest") {
      temp.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sort === "newest") {
      temp.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFiltered(temp);
    setCurrentPage(1);
  }, [filter, filters, sort, vehicles]);

  const handleFilterChange = (type) => setFilter(type);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilter("all");
    setFilters({
      seater: "",
      location: "",
      fuelType: "",
      startDate: "",
      maxPrice: 5000,
    });
    setSort("");
  };

  const handleBookNow = (vehicleId) => {
    navigate(`/booking-system/${vehicleId}`);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="vehicles-container">
      <h1 className="vehicles-heading">Available Vehicles</h1>

      <div className="vehicle-type-buttons">
        {["all", "car", "bike"].map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => handleFilterChange(type)}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
          </button>
        ))}
      </div>

      <div className="filter-grid">
        <input
          type="text"
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleInputChange}
          className="filter-input"
        />
        <select name="seater" value={filters.seater} onChange={handleInputChange} className="filter-input">
          <option value="">All Seaters</option>
          <option value="2">2 Seater</option>
          <option value="4">4 Seater</option>
          <option value="5">5 Seater</option>
          <option value="7">7 Seater</option>
        </select>
        <select name="fuelType" value={filters.fuelType} onChange={handleInputChange} className="filter-input">
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleInputChange}
          className="filter-input"
        />
        <div className="range-container">
          <label htmlFor="maxPrice">Max Price/Day: ₹{filters.maxPrice}</label>
          <input
            type="range"
            id="maxPrice"
            name="maxPrice"
            min="100"
            max="5000"
            step="100"
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
        </div>
        <select name="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="filter-input">
          <option value="">Sort By</option>
          <option value="lowest">Lowest Price</option>
          <option value="highest">Highest Price</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <button onClick={resetFilters} className="reset-button">
        Reset Filters
      </button>

      <div className="vehicle-grid">
        {paginated.length > 0 ? (
          paginated.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <img src={vehicle.imageUrl} alt={vehicle.model} className="vehicle-image" />
              <h2>{vehicle.brand} {vehicle.model}</h2>
              <p>Type: {vehicle.type}</p>
              <p>Seater: {vehicle.seater}</p>
              <p>Fuel: {vehicle.fuelType}</p>
              <p>Location: {vehicle.location}</p>
              <p>Availability: {vehicle.startDate}</p>
              <p className="price">₹{vehicle.pricePerDay} / day</p>
              <button className="book-btn2" onClick={() => handleBookNow(vehicle.id)}>
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No vehicles match your criteria.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllVehicles;
