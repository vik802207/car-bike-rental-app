import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import "./AdminMyVehicles.css"; // ← Plain CSS file

const AdminMyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", type: "" });
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "vehicles"), where("ownerId", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vehiclesData = [];
      querySnapshot.forEach((doc) =>
        vehiclesData.push({ id: doc.id, ...doc.data() })
      );
      setVehicles(vehiclesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredVehicles = vehicles.filter((v) => {
    return (
      (filters.city === "" || v.location.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.type === "" || v.type === filters.type)
    );
  });

  const handleEditClick = (vehicle) => {
    setEditVehicleId(vehicle.id);
    setEditFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      pricePerDay: vehicle.pricePerDay,
      location: vehicle.location,
      type: vehicle.type,
      imageUrl: vehicle.imageUrl,
      availability: vehicle.availability ?? true,
      startDate: vehicle.startDate ?? "",
      endDate: vehicle.endDate ?? "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "availability" ? value === "true" : value,
    }));
  };

  const handleSaveClick = async () => {
    if (!editVehicleId) return;

    try {
      const vehicleRef = doc(db, "vehicles", editVehicleId);
      await updateDoc(vehicleRef, {
        ...editFormData,
        pricePerDay: Number(editFormData.pricePerDay),
        availability: editFormData.availability === true || editFormData.availability === "true",
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
      });
      alert("Vehicle updated successfully");
      setEditVehicleId(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle");
    }
  };

  const handleCancelClick = () => {
    setEditVehicleId(null);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await deleteDoc(doc(db, "vehicles", id));
      alert("Vehicle deleted");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    }
  };

  if (loading) return <p className="no-data">Loading vehicles...</p>;

  return (
    <div className="container">
      <h1 className="page-title">My Vehicles</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="city"
          placeholder="Filter by city"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>
      </div>

      {/* Vehicles Table */}
      {filteredVehicles.length === 0 ? (
        <p className="no-data">No vehicles found.</p>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Brand + Model</th>
              <th>Price/day</th>
              <th>Location</th>
              <th>Type</th>
              <th>Availability</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>
                  <img src={vehicle.imageUrl} alt={vehicle.brand} />
                </td>

                {editVehicleId === vehicle.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="brand"
                        value={editFormData.brand}
                        onChange={handleEditChange}
                      />
                      <input
                        type="text"
                        name="model"
                        value={editFormData.model}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={editFormData.pricePerDay}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <select
                        name="type"
                        value={editFormData.type}
                        onChange={handleEditChange}
                      >
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="availability"
                        value={editFormData.availability}
                        onChange={handleEditChange}
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="startDate"
                        value={editFormData.startDate}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="endDate"
                        value={editFormData.endDate}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button className="btn-save" onClick={handleSaveClick}>Save</button>
                      <button className="btn-cancel" onClick={handleCancelClick}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{vehicle.brand} {vehicle.model}</td>
                    <td>₹{vehicle.pricePerDay}</td>
                    <td>{vehicle.location}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.availability ? "Available" : "Not Available"}</td>
                    <td>{vehicle.startDate || "-"}</td>
                    <td>{vehicle.endDate || "-"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEditClick(vehicle)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteClick(vehicle.id)}>Delete</button>
                      <Link to={`/vehicle/${vehicle.id}`}>Details</Link>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMyVehicles;
