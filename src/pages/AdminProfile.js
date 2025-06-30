import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  query,
  getDoc,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.css";

const AdminProfile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [vehiclesCount, setVehiclesCount] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchVehicles = async () => {
      const q = query(collection(db, "vehicles"), where("ownerId", "==", user.uid));
      const snapshot = await getDocs(q);
      setVehiclesCount(snapshot.size);
    };
    fetchVehicles();
  }, [user, navigate]);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    setMessage("");

    try {
      const docRef = doc(db, "adminProfiles", user.uid);
      const docSnap = await getDoc(docRef);

      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL,
        updatedAt: new Date().toISOString(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, profileData);
        setMessage("Profile updated successfully.");
      } else {
        await setDoc(docRef, profileData);
        setMessage("Profile created and saved to database!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile or save data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>

      <p><strong>Email:</strong> {user?.email}</p>

      <label className="profile-label">
        Display Name:
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="profile-input"
          placeholder="Enter display name"
        />
      </label>

      <label className="profile-label">
        Profile Photo URL:
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          className="profile-input"
          placeholder="Paste image URL"
        />
      </label>

      {photoURL && (
        <div className="profile-image-wrapper">
          <img src={photoURL} alt="Profile" className="profile-image" />
        </div>
      )}

      <p className="profile-count">
        <strong>Your vehicles listed:</strong> {vehiclesCount !== null ? vehiclesCount : "Loading..."}
      </p>

      {message && <p className="profile-message">{message}</p>}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="profile-button update-button"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

      <button
        onClick={handleLogout}
        className="profile-button logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
