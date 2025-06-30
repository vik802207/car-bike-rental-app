import React, { useState } from "react";
import axios from "axios";

const AddVehicle = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("car");
  const [imageUrl, setImageUrl] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(""); // <-- New location state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const vehicleData = {
        name,
        type,
        imageUrl,
        pricePerDay: Number(pricePerDay),
        description,
        location, // <-- Include location in data sent to backend
      };

      await axios.post("/api/vehicles", vehicleData);
      setSuccess("Vehicle added successfully!");
      // Clear form
      setName("");
      setType("car");
      setImageUrl("");
      setPricePerDay("");
      setDescription("");
      setLocation("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Add Vehicle</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Vehicle Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {/* Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>

        {/* Image URL */}
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {/* Price Per Day */}
        <input
          type="number"
          placeholder="Price Per Day"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />

        {/* Location - New Input */}
        <input
          type="text"
          placeholder="Location (City or Address)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
