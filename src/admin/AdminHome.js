import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import {
  FaCar,
  FaMotorcycle,
  FaMoneyBillWave,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import BookingChart from "./BookingChart";
import AdminTopbar from "./AdminTopbar";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, getDoc,updateDoc } from "firebase/firestore";
import { data, useNavigate } from "react-router-dom";

const AdminHome = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [totalCars, setTotalCars] = useState(0);
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
 const[accounts,setAccounts]=useState([])
  const [adminName, setAdminName] = useState("");
  const [adminPhoto, setAdminPhoto] = useState("");
const fetchCards = async () => {
    if (!user) return;
    const docRef = doc(db, "adminProfiles", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAccounts(docSnap.data().accountCards || []);
      const storedTotal = localStorage.getItem("totalEarnings");
      if (storedTotal) setTotalEarnings(parseFloat(storedTotal));
    }
  };
    useEffect(() => {
      fetchCards();
    }, [user]);
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  
    const fetchData = async () => {
      try {
        // Fetch vehicles
        const vehiclesSnap = await getDocs(collection(db, "vehicles"));
        let cars = 0,
          bikes = 0;

        vehiclesSnap.forEach((doc) => {
          const data = doc.data();
          if (data.ownerId === user?.uid) {
            if (data.type === "car") cars++;
            if (data.type === "bike") bikes++;
          }
        });

        setTotalCars(cars);
        setTotalBikes(bikes);
        // Fetch admin profile from Firestore
        const profileRef = doc(db, "adminProfiles", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setAdminName(profileData.displayName || "Admin");
          setAdminPhoto(profileData.photoURL || "");
          setWalletBalance(profileData.walletBalance || totalEarnings);
          if (!profileData.walletBalance || profileData.walletBalance === 0) {
    await updateDoc(profileRef, {
      walletBalance: totalEarnings,
    });
  }
        } else {
          setAdminName("Admin");
          setAdminPhoto("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate, user]);

  const chartData = [
    { month: "Jan", bookings: 120 },
    { month: "Feb", bookings: 200 },
    { month: "Mar", bookings: 150 },
    { month: "Apr", bookings: 278 },
    { month: "May", bookings: 189 },
    { month: "Jun", bookings: 239 },
    { month: "Jul", bookings: 349 },
    { month: "Aug", bookings: 400 },
    { month: "Sep", bookings: 300 },
    { month: "Oct", bookings: 270 },
    { month: "Nov", bookings: 390 },
    { month: "Dec", bookings: 450 },
  ];

  return (
    <div className="admin-home">
      <AdminTopbar email={user?.email} name={adminName} photoURL={adminPhoto} />

      {/* Welcome section */}
      <div className="admin-title-bar">
        <h2 className="admin-title">Welcome, {adminName || "Admin"}</h2>
      </div>

      {/* Stats cards */}
      <div className="stat-cards">
        <div className="card purple">
          <FaCar className="card-icon" />
          <div>
            <h3>{totalCars} Cars</h3>
            <p>Total Added Cars</p>
          </div>
        </div>

        <div className="card red">
          <FaMotorcycle className="card-icon" />
          <div>
            <h3>{totalBikes} Bikes</h3>
            <p>Total Added Bikes</p>
          </div>
        </div>

        <div className="card green">
          <FaMoneyBillWave className="card-icon" />
          <div>
            <h3>₹{totalEarnings.toLocaleString()}</h3>
            <p>Total Earnings</p>
          </div>
        </div>

        

        <div className="card yellow">
          <FaWallet className="card-icon" />
          <div className="wallet-content">
            <div>
              <h3>₹{walletBalance.toFixed(2)} </h3>
              <p  style={{position:"relative",top:"-10px"}}>Admin Wallet Balance</p>
            </div>
            <button 

              className="withdraw-btn"
              onClick={() =>navigate('/withdrawnMoney') }
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Chart section */}
      <div className="chart-section" style={{marginTop:"20px"}}>
        <BookingChart data={chartData} />
      </div>
    </div>
  );
};

export default AdminHome;
