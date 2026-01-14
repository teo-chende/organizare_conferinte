import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';

// Dashboards
import DashboardOrganizator from './components/organizator/DashboardOrganizator';
import DashboardAutor from './components/autor/DashboardAutor';
import DashboardReviewer from './components/reviewer/DashboardReviewer';

// Componente specifice
import CreateConferinta from './components/organizator/CreateConferinta';
import ManageConferinta from './components/organizator/ManageConferinta';
import SubmitArticol from './components/autor/SubmitArticol';
import ArticoleleMe from './components/autor/ArticoleleMe';
import ArticoleDeReviewed from './components/reviewer/ArticoleDeReviewed';
import ReviewForm from './components/reviewer/ReviewForm';

import './App.css';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirecționare către dashboard-ul corespunzător rolului
  const getDashboardPath = () => {
    if (!user) return '/';
    
    switch (user.rolId) {
      case 1: return '/organizator';
      case 2: return '/reviewer';
      case 3: return '/autor';
      default: return '/';
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Register />} 
          />

          {/* Rute Organizator */}
          <Route 
            path="/organizator" 
            element={
              <ProtectedRoute requiredRole={1}>
                <DashboardOrganizator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizator/conferinta-noua" 
            element={
              <ProtectedRoute requiredRole={1}>
                <CreateConferinta />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizator/conferinta/:id" 
            element={
              <ProtectedRoute requiredRole={1}>
                <ManageConferinta />
              </ProtectedRoute>
            } 
          />

          {/* Rute Autor */}
          <Route 
            path="/autor" 
            element={
              <ProtectedRoute requiredRole={3}>
                <DashboardAutor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/autor/submit-articol" 
            element={
              <ProtectedRoute requiredRole={3}>
                <SubmitArticol />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/autor/articolele-mele" 
            element={
              <ProtectedRoute requiredRole={3}>
                <ArticoleleMe />
              </ProtectedRoute>
            } 
          />

          {/* Rute Reviewer */}
          <Route 
            path="/reviewer" 
            element={
              <ProtectedRoute requiredRole={2}>
                <DashboardReviewer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reviewer/articole" 
            element={
              <ProtectedRoute requiredRole={2}>
                <ArticoleDeReviewed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reviewer/review/:articolId" 
            element={
              <ProtectedRoute requiredRole={2}>
                <ReviewForm />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<div className="not-found"><h2>404 - Pagină negăsită</h2></div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
