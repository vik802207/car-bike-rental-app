# 🚗 Car-Bike Rental App

A modern web application to rent cars and bikes, with support for user authentication, admin uploads, booking system, wallet transactions, and filtering vehicles by location, price, and type.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Syncfusion UI
- **Backend**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (Email/Password, Google, Phone OTP)
- **Image Hosting**: ImageBB
- **Payment**: Razorpay Wallet Top-up
- **State Management**: React Context API
- **Deployment**: Vercel / Netlify

---

## 🔑 Features

### 👤 User Side
- 🔐 Sign Up / Login (Email, Phone OTP, Google)
- 📃 Profile Management
- 🔍 Browse Cars & Bikes
- 🧭 Filter by City, Price, Type, Features
- 📸 View Vehicle Details with Photos, Features
- 📆 Book for Specific Date/Time Range
- 💳 Wallet Top-up (Razorpay Integration)
- 📜 View Bookings & Transactions History

### 🛠️ Admin Panel
- 🚗 Add New Vehicle (form with image URL)
- ✏️ Edit / 🗑️ Delete Vehicle
- 🗂️ View All Bookings
- 💰 View Wallet Transactions
- 📈 Dashboard with Charts & Stats

---

## 🔧 Project Setup

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/car-bike-rental.git
cd car-bike-rental
2. Install Dependencies
npm install
4. Run Locally
npm start
```
## 🚗 Admin Vehicle Upload Format

Admins can upload a vehicle using the form with the following fields:

| Field              | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| 🖼️ **Image URL**     | Direct image link (e.g., from [imgbb.com](https://imgbb.com/))              |
| 🏷️ **Brand & Model** | Example: "Honda City", "Yamaha R15"                                         |
| 💰 **Price/Day**      | Numeric value (e.g., `500` per day or `30` per hour)                        |
| 🏙️ **City**           | Location of the vehicle (e.g., `Delhi`, `Mumbai`)                          |
| 🚘 **Type**           | Choose between `Car` or `Bike`                                             |
| ⛽ **Fuel Type**      | `Petrol`, `Diesel`, or `Electric`                                          |
| ❄️ **AC**             | Yes / No                                                                   |
| ⚙️ **Transmission**   | `Manual` or `Automatic`                                                     |
| 🪑 **Seats**          | Number of seats (e.g., `2`, `5`, `7`)                                       |
| 📅 **Availability**   | Select **Start Date** and **End Date** for availability                    |

> ✅ All fields are required unless marked optional. Admin must ensure valid data input and image links.

---

### 🔗 Example Image Upload (via imgbb)

1. Go to [imgbb.com](https://imgbb.com/)
2. Upload your image.
3. Copy the **Direct Link** URL (ends in `.jpg`, `.png`, etc.).
4. Paste it into the **Image URL** field.

---
✨ Screenshots
