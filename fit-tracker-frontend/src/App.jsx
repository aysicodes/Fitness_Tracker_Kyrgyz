import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Auth from './components/Auth';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import ActivityPage from './components/ActivityPage';
import Goals from "./components/Goals";
import WorkoutsPage from './components/WorkoutsPage';
import Layout from './components/Layout'; // Жаңы импорт

function App() {
    const { isAuthenticated } = useAuth();

    // Авторизация болгон колдонуучулар үчүн Layout менен ороо функциясы
    const ProtectedRoute = ({ children }) => {
        return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/" />;
    };

    return (
        <ThemeProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public routes (Layout жок) */}
                        <Route path="/" element={
                            isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />
                        } />
                        <Route path="/register" element={
                            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
                        } />

                        {/* Authenticated routes (Layout менен оролгон) */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                        <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
                        <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />

                        {/* Navigation for rest links */}
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;