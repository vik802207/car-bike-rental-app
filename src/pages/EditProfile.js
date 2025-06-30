import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './EditProfile.css';

const EditProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    web3Wallet: "",
    enterprise: "",
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setFormData((prev) => ({ ...prev, ...snap.data() }));
        } else {
          const [firstName, lastName = ""] = user.displayName?.split(" ") || ["", ""];
          setFormData((prev) => ({
            ...prev,
            firstName,
            lastName,
            email: user.email || "",
          }));
        }
      };

      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      await updateDoc(docRef, formData);
    } else {
      await setDoc(docRef, formData); // creates new doc
    }

    alert("Profile saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="edit-profile-container">
      <h2 className="page-title">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">

        {/* Personal Info */}
        <div className="profile-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} disabled />
            </div>
            <div className="form-group full-width">
              <label>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="profile-section">
          <h3 className="section-title">Social Media Account</h3>
          <div className="form-group full-width">
            <label>Facebook</label>
            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label>Instagram</label>
            <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} />
          </div>
        </div>

        {/* Other */}
        <div className="profile-section">
          <h3 className="section-title">Other</h3>
          <div className="form-group full-width">
            <label>Web3 Wallet</label>
            <input type="text" name="web3Wallet" value={formData.web3Wallet} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label>Enterprise Account</label>
            <input type="text" name="enterprise" value={formData.enterprise} onChange={handleChange} />
          </div>
        </div>

        <div className="button-group">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
