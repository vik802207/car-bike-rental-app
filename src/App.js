import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PhoneLogin from "./pages/PhoneLogin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import Cars from "./pages/Cars";
import Bikes from "./pages/Bikes";
import AddVehicle from "./pages/AddVehicle";
import AddVehicleFirebase from "./pages/AddVehicleFirebase";
import AllVehicles from "./pages/AllVehicles";
import AdminLoginSignup from "./pages/AdminLoginSignup";
import AdminMyVehicles from "./pages/AdminMyVehicles";
import AdminProfile from "./pages/AdminProfile";
import AdminDashboard from "./pages/AdminDashboard";
import BookingSystem from "./pages/BookingSystem";
import AddMoney from "./pages/AddMoney";
import TransactionHistory from "./pages/TransactionHistory";
import Navbar from "./pages/Navbar";
import ProfileSidebar from "./pages/ProfileSidebar";
import EditProfile from "./pages/EditProfile";
import { NotificationProvider } from "./context/NotificationContext";
import CancelBooking from "./pages/CancelBooking";
import MyCoupons from "./component/MyCoupons";
import WithdrawAccounts from "./admin/WithdrawAccounts";
import ChooseRoleDashboard from "./ChooseRoleDashboard";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <NotificationProvider>
      <Routes>
      <Route  path="/" element={<ChooseRoleDashboard/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
          <Route path="/cars" element={<Cars/>} />
          <Route path="/bikes" element={<Bikes/>} />
          <Route path="/booking-system/:vehicleId" element={<BookingSystem />} />
          <Route path="/mytransactionHistory" element={<TransactionHistory/>}/>
          <Route path="/profile" element={<ProfileSidebar/>}/>
          <Route path="/editprofile" element={<EditProfile/>}/>
          <Route path="/cancel-booking" element={<CancelBooking/> }/>
          <Route path="/mycoupons" element={<MyCoupons/>}/>
          <Route path="/add-money" element={<AddMoney/>} />
          <Route path="/add-vehicle" element={<AddVehicleFirebase/>} />
          <Route path="/all-vehicles" element={<AllVehicles/>} />
          <Route path="/admin-signup" element={<AdminLoginSignup/>} />
          <Route path="/admin/my-vehicles" element={<AdminMyVehicles/>} />
          <Route path="/admin-profile" element={<AdminProfile/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/withdrawnMoney" element={<WithdrawAccounts/>}/>
          
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
