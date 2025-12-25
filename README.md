# 🏔️ Ala-Too Fit

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fittrackerkyrgyz.vercel.app)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://fitness-tracker-kyrgyz.onrender.com)

**Ala-Too Fit** is a professional **full-stack** health platform inspired by **Ala-Too International University**. It is designed to help users track their fitness journey with a focus on localization for **Kyrgyzstan**.

---

## 📸 Project Showroom

| **Authentication & Localization** | **Personal Activity Dashboard** |
|:---:|:---:|
| ![Login Page](./screenshots/auth.png) | ![Dashboard](./screenshots/dashboard_dark.png) |
| *Supports **KY, RU, and EN** languages* | *Real-time **charts** & **Dark Mode*** |

---

## 🌟 Core Features

* **Multilingual Interface:** Full support for **Kyrgyz**, **Russian**, and **English**.
* **Visual Analytics:** Interactive **charts** for monitoring **Calories** and **Steps**.
* **Health Profiles:** Securely manage **Weight**, **Height**, and **Age** metrics.
* **Workout Logging:** Flexible system for **Running**, **Cycling**, or **Custom** exercises.
* **Goal Setting:** Track personal **Milestones** and fitness achievements.

---

## 🛠️ Technical Architecture

### **Frontend (Client)**
* **React.js (Vite):** Powering the fast, responsive **UI**.
* **i18next:** Handling complex **Localization** and language switching.
* **Chart.js:** Rendering dynamic **Data Visualizations**.
* **Axios:** Managing **REST API** communication.

### **Backend (Server)**
* **Spring Boot:** Core **Java** framework for business logic.
* **Spring Security:** Implementation of **JWT** and **CORS** protocols.
* **PostgreSQL:** Reliable **Database** for user data persistence.

---

## 🔧 Challenges & Solutions

During development, I encountered a critical **CORS 403 Forbidden** error when connecting the Vercel frontend to the Render backend. 

**The Solution:**
* Configured a custom `CorsConfigurationSource` in **Spring Security**.
* Specifically allowed **Origin Patterns** for `*.vercel.app`.
* Added `Accept-Language` to **Allowed Headers** to support the localization feature.
* Handled the **OPTIONS** preflight requests by placing them at the top of the **Security Filter Chain**.

---

## 👩‍💻 About the Developer
Developed by **Aizirek** as a capstone project. 
**Institution:** Ala-Too International University (AIU).

Swagger link: https://fitness-tracker-kyrgyz.onrender.com/swagger-ui/index.html
