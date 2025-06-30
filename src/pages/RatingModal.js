import React from "react";

const RatingModal = ({ isOpen, onClose, onSubmit, vehicleName }) => {
  const [rating, setRating] = React.useState(0);

  const handleSubmit = () => {
    if (rating > 0) onSubmit(rating);
    alert("Rating Vehicle Successful")
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>⭐ Rate {vehicleName}</h3>
        <div style={{ fontSize: "24px", margin: "10px 0" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ cursor: "pointer", color: star <= rating ? "#ffc107" : "#ddd" }}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleSubmit} style={{ marginRight: 8 }}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 999,
};

const modalStyle = {
  backgroundColor: "#fff", padding: "20px", borderRadius: "8px", minWidth: "300px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)", textAlign: "center"
};

export default RatingModal;
