# 🏔️ Ala-Too Fit 
𝑫𝑼𝑬 𝑻𝑶 𝑨 𝑮𝑰𝑻 𝑰𝑺𝑺𝑼𝑬 𝑫𝑼𝑹𝑰𝑵𝑮 𝑭𝑰𝑵𝑨𝑳 𝑫𝑬𝑷𝑳𝑶𝒀𝑴𝑬𝑵𝑻, 𝑴𝒀 𝑪𝑶𝑴𝑴𝑰𝑻 𝑯𝑰𝑺𝑻𝑶𝑹𝒀 𝑾𝑨𝑺 𝑳𝑶𝑺𝑻. 𝑯𝑶𝑾𝑬𝑽𝑬𝑹, 𝑻𝑯𝑬 𝑪𝑶𝑫𝑬 𝑰𝑺 𝑭𝑼𝑳𝑳𝒀 𝑭𝑼𝑵𝑪𝑻𝑰𝑶𝑵𝑨𝑳 𝑨𝑵𝑫 𝑻𝑯𝑬 𝑷𝑹𝑶𝑱𝑬𝑪𝑻 𝑴𝑬𝑬𝑻𝑺 𝑨𝑳𝑳 𝑹𝑬𝑸𝑼𝑰𝑹𝑬𝑴𝑬𝑵𝑻𝑺

𝑫𝑬𝑽𝑬𝑳𝑶𝑷𝑴𝑬𝑵𝑻 𝑯𝑰𝑺𝑻𝑶𝑹𝒀 𝑰𝑺 𝑷𝑹𝑬𝑺𝑬𝑹𝑽𝑬𝑫 𝑰𝑵 𝑻𝑯𝑬 𝑭𝑰𝑻-𝑻𝑹𝑨𝑪𝑲𝑬𝑹-𝑨𝑹𝑪𝑯𝑰𝑽𝑬-𝑯𝑰𝑺𝑻𝑶𝑹𝒀 𝑩𝑹𝑨𝑵𝑪𝑯!

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fittrackerkyrgyz.vercel.app)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://fitness-tracker-kyrgyz.onrender.com)
[![Swagger UI](https://img.shields.io/badge/Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://fitness-tracker-kyrgyz.onrender.com/swagger-ui/index.html)

**Ala-Too Fit** is a professional **Full-Stack Fitness Management System** inspired by the excellence of **Ala-Too International University**. This platform provides a localized, data-driven experience for users to track workouts, set goals, and monitor health metrics.

---

## 📸 Project Showroom

### 🔐 **Authentication & Localization**
| **Sign In** | **Sign Up** |
|:---:|:---:|
| ![Sign In](./screenshots/signin.png) | ![Sign Up](./screenshots/signup.png) |
| *Secure **JWT-based** entry* | *Multilingual support (**KY, RU, EN**)* |

### 📊 **The Dashboard Experience**
| **Kyrgyz Interface** | **Dark Mode** |
|:---:|:---:|
| ![Kyrgyz Dashboard](./screenshots/dashboard-ky.png) | ![Dark Mode](./screenshots/dashboard-dark.png) |
| *Full **Кыргызча** translation* | *Eye-friendly night viewing* |

### 🏋️ **Workout & Activity Tracking**
| **Add New Workout** | **Workout List** |
|:---:|:---:|
| ![Add Workout](./screenshots/workout-form.png) | ![Workout History](./screenshots/workouts-page.png) |
| *Custom & Predefined types* | *Daily logs with calorie tracking* |

### 🎯 **Goals & Progress**
| **Fitness Goals** | **Activity Tracking** |
|:---:|:---:|
| ![Goals](./screenshots/goals.png) | ![Activity](./screenshots/activity.png) |
| *Set and achieve milestones* | *Step & calorie visualization* |

### 👤 **User Management**
| **User Profile** |
|:---:|
| ![Profile](./screenshots/userprofile.png) |
| *Manage **Height, Weight, & Age*** |

---

## 🌟 Core Features

* **Localized for Kyrgyzstan:** Full translation support for **Кыргызча**, **Русский**, and **English**.
* **Smart Analytics:** Interactive **Chart.js** graphs showing progress over the last **30 days**.
* **Comprehensive Metrics:** Track **BMI-related data** to see physical changes over time.
* **Flexible Workouts:** Support for **Running**, **Cycling**, **Weightlifting**, and **Custom activities**.
* **Goal-Oriented:** A dedicated system to create and manage personal **Fitness Milestones**.

---

## 🛠️ Technical Architecture

### **Frontend**
* **React.js (Vite):** Blazing fast **UI** performance.
* **i18next:** Advanced **Internationalization** framework.
* **Axios:** Secure **REST API** handling.
* **Context API:** Global state for **Auth** and **Theme**.

### **Backend**
* **Spring Boot:** Enterprise-grade **Java** backend.
* **Spring Security:** Expert handling of **CORS**, **JWT**, and **Security Filter Chains**.
* **PostgreSQL:** Reliable storage for user and workout data.

---

## 🔧 Technical Challenges Overcome
* **CORS Policy:** Solved **403 Forbidden** errors by implementing a custom `CorsConfigurationSource` allowing cross-origin requests from Vercel to Render.
* **Cold Starts:** Optimized frontend **Axios timeouts** to account for Render's free-tier "sleep" mode.
* **Preflight Requests:** Configured Spring Security to permit all **OPTIONS** requests globally.

---
