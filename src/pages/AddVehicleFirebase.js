import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AddVehicleFirebase.css";

const AddVehicleFirebase = () => {
  const [vehicle, setVehicle] = useState({
    type: "car",
    brand: "",
    model: "",
    vehicleModel: "HATCHBACK",
    seater: "4",
    pricePerDay: "",
    location: "",
    imageUrl: "",
    userUID: "",
    vehicle: "AC",
    fuelType: "Petrol",
    availability: "Yes",
    startDate: "",
    endDate: "",
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state ||
            "Unknown";
          setVehicle((prev) => ({ ...prev, location: city }));
        } catch (err) {
          console.error("Location fetch failed:", err);
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      if (value === "bike") {
        setVehicle({
          type: "bike",
          brand: "",
          model: "",
          vehicleModel: "",
          seater: "",
          pricePerDay: "",
          location: "",
          imageUrl: "",
          userUID: "",
          vehicle: "",
          fuelType: "",
          availability: "",
          startDate: "",
          endDate: "",
        });
      } else {
        setVehicle({
          type: "car",
          brand: "",
          model: "",
          vehicleModel: "HATCHBACK",
          seater: "4",
          pricePerDay: "",
          location: "",
          imageUrl: "",
          userUID: "",
          vehicle: "AC",
          fuelType: "Petrol",
          availability: "Yes",
          startDate: "",
          endDate: "",
        });
      }
    } else {
      setVehicle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = ["brand", "model", "pricePerDay", "location", "imageUrl", "userUID", "startDate", "endDate"];
    for (let field of requiredFields) {
      if (!vehicle[field] || !vehicle[field].toString().trim()) {
        alert(`Please fill in the ${field}`);
        return false;
      }
    }

    if (new Date(vehicle.startDate) > new Date(vehicle.endDate)) {
      alert("Start date cannot be after end date");
      return false;
    }

    if (vehicle.type === "car") {
      if (!vehicle.vehicleModel || !vehicle.seater || !vehicle.vehicle || !vehicle.fuelType || !vehicle.availability) {
        alert("Please fill in all car-specific fields");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    try {
      await addDoc(collection(db, "vehicles"), {
        ...vehicle,
        pricePerDay: Number(vehicle.pricePerDay),
        createdAt: Timestamp.now(),
        ownerId: auth.currentUser?.uid || "admin",
      });

      alert("Vehicle added successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-vehicle-container">
      <h2 className="form-title">🚗 Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="add-vehicle-form">
        <select name="type" value={vehicle.type} onChange={handleChange}>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>

        <input type="text" name="brand" placeholder="Brand" value={vehicle.brand} onChange={handleChange} />
        <input type="text" name="model" placeholder="Model" value={vehicle.model} onChange={handleChange} />

        {vehicle.type === "car" && (
          <>
            <select name="vehicleModel" value={vehicle.vehicleModel} onChange={handleChange}>
              <option value="HATCHBACK">Hatchback</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
            </select>

            <select name="seater" value={vehicle.seater} onChange={handleChange}>
              {[4, 5, 6, 7].map((s) => (
                <option key={s} value={s}>{s} Seater</option>
              ))}
            </select>

            <select name="vehicle" value={vehicle.vehicle} onChange={handleChange}>
              <option value="AC">AC</option>
              <option value="Non AC">Non AC</option>
            </select>

            <select name="fuelType" value={vehicle.fuelType} onChange={handleChange}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>

            <select name="availability" value={vehicle.availability} onChange={handleChange}>
              <option value="Yes">Available</option>
              <option value="No">Not Available</option>
            </select>
          </>
        )}

        <label>Start Date Availability</label>
        <input type="date" name="startDate" value={vehicle.startDate} onChange={handleChange} />

        <label>End Date Availability</label>
        <input type="date" name="endDate" value={vehicle.endDate} onChange={handleChange} />

        <input type="number" name="pricePerDay" placeholder="Price Per Day" value={vehicle.pricePerDay} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={vehicle.location} onChange={handleChange} />

        <button type="button" className="info-button" onClick={() => window.open("https://imgbb.com/", "_blank")}>
          Upload Image on imgbb
        </button>

        <input type="text" name="imageUrl" placeholder="Paste Image URL from imgbb" value={vehicle.imageUrl} onChange={handleChange} />
        <input type="text" name="userUID" placeholder="Enter User UID" value={vehicle.userUID} onChange={handleChange} />

        <button type="submit" disabled={uploading}>
          {uploading ? "Submitting..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicleFirebase;
