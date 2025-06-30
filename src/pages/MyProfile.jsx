import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";

const MyProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        const fallbackData = {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          phone: "",
          role: "User",
          dob: "",
          country: "",
          city: "",
          postalCode: "",
        };

        if (snap.exists()) {
          setProfile({ ...fallbackData, ...snap.data() });
        } else {
          setProfile(fallbackData);
          await setDoc(docRef, fallbackData); // initialize if not exists
        }
      }
    };
    fetchData();
  }, [user]);

  const handleAutoFillAddress = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.address || {};

          const updatedFields = {
            country: address.country || "",
            city: address.city || address.town || address.village || "",
            postalCode: address.postcode || "",
          };

          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, updatedFields);

          setProfile((prev) => ({
            ...prev,
            ...updatedFields,
          }));

          alert("Address updated successfully from your location!");
        } catch (error) {
          console.error("Error during reverse geocoding:", error);
          alert("Failed to retrieve location details.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to access location.");
      }
    );
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="profile-container">
      {/* Top Profile Card */}
      <div className="profile-card">
        <img
          src={
            profile.photoURL ||
            "https://ui-avatars.com/api/?name=" + profile.firstName
          }
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-header-info">
          <h2 className="profile-name">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="profile-role">{profile.role || "User"}</p>
          <p className="profile-location">
            {profile.city ? `${profile.city}, ${profile.country}` : ""}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h3 className="profile-section-title">Personal Information</h3>
          <button
            onClick={() => navigate("/editprofile")}
            className="edit-button orange"
          >
            ✏️ Edit
          </button>
        </div>
        <div className="profile-grid">
          <div>
            <label className="field-label">First Name</label>
            <p>{profile.firstName}</p>
          </div>
          <div>
            <label className="field-label">Last Name</label>
            <p>{profile.lastName}</p>
          </div>
          <div>
            <label className="field-label">Date of Birth</label>
            <p>{profile.dob || "—"}</p>
          </div>
          <div>
            <label className="field-label">Email Address</label>
            <p>{profile.email}</p>
          </div>
          <div>
            <label className="field-label">Phone Number</label>
            <p>{profile.phone || "—"}</p>
          </div>
          <div>
            <label className="field-label">User Role</label>
            <p>{profile.role || "User"}</p>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h3 className="profile-section-title">Address</h3>
          <button className="edit-button gray" onClick={handleAutoFillAddress}>
            📍 Auto-Fill
          </button>
        </div>
        <div className="profile-grid">
          <div>
            <label className="field-label">Country</label>
            <p>{profile.country || "—"}</p>
          </div>
          <div>
            <label className="field-label">City</label>
            <p>{profile.city || "—"}</p>
          </div>
          <div>
            <label className="field-label">Postal Code</label>
            <p>{profile.postalCode || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
