import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/auth/Auth";
import Devices from "./pages/devices/Devices";
import Groups from "./pages/Groups/Groups";
import Configs from "./pages/configs/Configs";
import Dashboard from "./pages/dashboard/Dashboard";
import Patches from "./pages/patches/Patches";
import UserManagement from "./pages/userManagement/UserManagement";
import InterfaceConfig from "./pages/interfaceConfigs/InterfaceConfig";

export default function AppRoutes() {
  // Inline ProtectedRoute
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("UGXAuthorization");
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Auth />} />

      {/* Protected routes */}
      {/* <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interface-config"
        element={
          <ProtectedRoute>
            <InterfaceConfig />
          </ProtectedRoute>
        }
      />

      <Route
        path="/configs"
        element={
          <ProtectedRoute>
            <Configs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patches"
        element={
          <ProtectedRoute>
            <Patches />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      {/* Optional: redirect unknown routes */}
      <Route path="*" element={<Navigate to="/groups" replace />} />
    </Routes>
  );
}
