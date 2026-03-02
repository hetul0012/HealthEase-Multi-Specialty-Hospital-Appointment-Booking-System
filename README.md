# HealthEase - Appointment Booking System

HealthEase is a multi-specialty hospital with an appointment booking system designed to simplify the process of finding the right medical department and booking doctor appointments.  
It includes **Patient**, and **Admin** portals with role-based login and CRUD features.

---

##  Features

###  Patient
- Register / Login
- Browse doctors + filter/search
- Book appointments
- View & manage appointments
- Patient dashboard + profile


### Admin Portal
- Admin login 
- Dashboard stats (doctors, patients, appointments)
- CRUD:
  - Departments (Add/Edit/Delete)
  - Doctors (Add/Edit/Delete)
  - Patients (View/Delete)
  - Appointments (Update status/Delete)

---

##  Tech Stack
- **Frontend:** React + Vite, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (role-based access)
- **Styling:** CSS (custom admin/patient dashboard styling)

---

##  Demo Login Credentials

### Admin
- **Email:** `admin@healthease.com`
- **Password:** `admin123`

---

##  Setup Instructions
1. Clone the repo  
   ```bash
   git clone https://github.com/hetul0012/HealthEase-Multi-Specialty-Hospital-Appointment-Booking-System.git

**Client:**
- npm run dev        
- npm run build      
- run seed  

**Server:**
- npm run dev 

###  Environment Variables

Create a `.env` file inside the `server` directory and add the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://HealthEase:HealthEase@cluster0.diqn0np.mongodb.net/HealthEase?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_key
