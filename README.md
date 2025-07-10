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
## 📽️ **Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/1_hTqwDtwGus68vguFbPhGjLkZ3aWVLBV/view?usp=sharing)  

## 🔗 Live On Netlify
## 👉 [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://magical-cat-74ec58.netlify.app/)
---
### 📦 Folder Structure
```bash
src/
├── components/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── VehicleDetails.jsx
│   ├── AdminDashboard.jsx
│   └── ...
├── context/     
├── utils/      
└── firebase.js
```
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
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(645).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(646).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(647).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(648).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(649).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(650).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(651).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(652).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(653).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(654).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(655).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(656).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(657).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(658).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(659).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(660).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(661).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(662).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(663).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(664).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(665).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(666).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(667).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(668).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(669).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(670).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(671).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(672).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(673).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(674).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(675).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(676).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(677).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(678).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(679).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(680).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(681).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(682).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(683).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(684).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(685).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(686).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(687).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(688).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(689).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(690).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(691).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(692).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(693).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(694).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(695).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(696).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(697).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(698).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(699).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(700).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(701).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(702).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(703).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(704).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(705).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(706).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(707).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(708).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(709).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(710).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(711).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(712).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(713).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(714).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(715).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(716).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(717).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(718).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(719).png?raw=true)
---
## DataBase
---
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(720).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(721).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(722).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(723).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(724).png?raw=true)
![Alt text](https://github.com/vik802207/car-bike-rental-app/blob/main/img/Screenshot%20(725).png?raw=true)



## 🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

## 📜 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Developed by Vikash Gupta
📧 Contact: vikashg802207@gmail.com












