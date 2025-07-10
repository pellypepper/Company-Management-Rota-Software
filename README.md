# 🏢 Company Rota System

A web-based rota and employee management application designed to streamline workforce scheduling, leave tracking, and staff role management.

---
<img width="1920" height="965" alt="screencapture-company-management-rota-software-fly-dev-staffdash-2025-07-10-15_20_59" src="https://github.com/user-attachments/assets/2add9184-3ab5-49db-b63f-a1ed5cdb953d" />
<img width="1920" height="1006" alt="screencapture-company-management-rota-software-fly-dev-hrdash-2025-07-10-15_21_30" src="https://github.com/user-attachments/assets/ea586ee0-fef4-449d-8777-88ac60747bc3" />
<img width="1920" height="977" alt="screencapture-company-management-rota-software-fly-dev-managerdash-2025-07-10-15_22_51" src="https://github.com/user-attachments/assets/5192d216-fe00-46be-adf4-f9b3c756d63d" />

## 📖 Project Description

The **Company Rota System** is a workforce management solution tailored for organizations to efficiently assign roles, schedule shifts, and handle leave requests. It supports three roles:

- 👥 **HR** – Assign staff roles and salaries, view all personnel.
- 🧑‍💼 **Managers** – Manage shifts, approve/deny leave requests, and monitor staff.
- 👤 **Staff** – View shift schedules, colleagues on duty, and request annual leave.

> Built using **Express.js**, **React**, and **PostgreSQL** for a full-stack, responsive experience.

--- Live Demo :https://companyrotasoftware-3f6dcaa37799.herokuapp.com](https://company-management-rota-software.fly.dev/

## 🚀 Features

- ✅ **Role Management** – Assign roles like `staff`, `manager`, `HR` and set pay rates.
- 📅 **Shift Management** – Managers can assign and view team schedules.
- 📬 **Leave Management** – Managers approve/reject leave requests.
- 🔍 **Staff Directory** – View detailed profiles of all staff members.
- 📆 **Calendar Integration** – Shifts visualized in a user-friendly calendar.
- ⏱️ **Upcoming Shifts** – Staff can view future shifts and shift history.
- 📝 **Annual Leave Requests** – Staff can request leave with a simple form.
- 👥 **Colleague View** – Staff can see which colleagues are on shift together.

---

## 🧰 Technologies Used

| Category         | Stack                          |
|------------------|--------------------------------|
| **Frontend**     | React, Bootstrap               |
| **Backend**      | Express.js                     |
| **Database**     | PostgreSQL                     |
| **Authentication** | Passport.js (Local Strategy)  |
| **Session Management** | express-session + pg-session |

---

## 🧪 Usage Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/company-rota-system.git
cd company-rota-system
2. Set Up Environment Variables
Create a .env file and define:

ini
Copy
Edit
DATABASE_URL=your_postgres_url
SESSION_SECRET=your_secret
EMAIL_API_KEY=your_email_key_if_applicable
3. Install Dependencies
bash
Copy
Edit
npm install
4. Start the Application
bash
Copy
Edit
npm run dev
Make sure PostgreSQL is running and migrations (if any) are set.

👨‍💼 User Roles & Access
👤 Staff
View upcoming shifts

See colleagues scheduled on the same shift

Submit annual leave requests

🧑‍💼 Managers
Assign shifts to staff

View full team schedule

Approve/deny leave requests

View staff directory

🧑‍💼 HR
Add new staff

Assign roles and pay

Access full system overview

🔒 Authentication Flow
Secure login using Passport.js

Sessions stored in PostgreSQL via pg-session

Email verification (activation link) upon registration

📬 Activation & Login
Register with your credentials

Receive an activation link via email

Verify your account

Log in to access your dashboard



© 2025 Company Rota System – Designed for smarter workforce management.

yaml
Copy
Edit
