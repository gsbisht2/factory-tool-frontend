import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Devices from "./pages/devices/Devices";
import Groups from "./pages/Groups/Groups";
import Configs from "./pages/configs/Configs";
import Dashboard from "./pages/dashboard/Dashboard";
import Patches from "./pages/patches/Patches";
import UserManagement from "./pages/userManagement/UserManagement";
import InterfaceConfig from "./pages/interfaceConfigs/InterfaceConfig";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={<Devices />} />
      <Route path="/devices" element={<Devices />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/interface-config" element={<InterfaceConfig />} />

      <Route path="/configs" element={<Configs />} />
      <Route path="/patches" element={<Patches />} />
      <Route path="/user-management" element={<UserManagement />} />
    </Routes>
  );
}
