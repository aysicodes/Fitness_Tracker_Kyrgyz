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

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <ThemeProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/*public routes*/}
                        <Route path="/" element={
                            isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />
                        } />
                        <Route path="/register" element={
                            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
                        } />

                        {/*authenticated routes*/}
                        <Route path="/dashboard" element={
                            isAuthenticated ? <Dashboard /> : <Navigate to="/" />
                        } />
                        <Route path="/profile" element={
                            isAuthenticated ? <UserProfile /> : <Navigate to="/" />
                        } />
                        <Route path="/goals" element={
                            isAuthenticated ? <Goals /> : <Navigate to="/" />
                        } />
                        <Route path="/workouts" element={
                            isAuthenticated ? <WorkoutsPage /> : <Navigate to="/" />
                        } />
                        <Route path="/activity" element={
                            isAuthenticated ? <ActivityPage /> : <Navigate to="/" />
                        } />

                        {/*navigation for rest links*/}
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;