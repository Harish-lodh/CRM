// src/components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminSidebar() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className="fixed top-16 left-0 bottom-0 w-80 bg-white border-r border-gray-200 text-gray-700 z-40 flex flex-col"
      aria-label="Admin Sidebar"
    >
      <nav className="flex-1 overflow-y-auto px-3 py-3 text-base">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition-all hover:bg-gray-100 ${
              isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
            }`
          }
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </NavLink>

        {/* Leads */}
        <NavLink
          to="/admin/leads"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 font-semibold rounded-lg transition-all hover:bg-gray-100 ${
              isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
            }`
          }
        >
          <DynamicFormIcon />
          <span>Leads</span>
        </NavLink>


        <NavLink
          to="/outlook"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 font-semibold rounded-lg transition-all hover:bg-gray-100 ${
              isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
            }`
          }
        >
          <DynamicFormIcon />
          <span>outlook</span>
        </NavLink>
      

        {/* Products */}
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 font-semibold rounded-lg transition-all hover:bg-gray-100 ${
              isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
            }`
          }
        >
          <CategoryIcon />
          <span>Products</span>
        </NavLink>

        <hr className="my-4 border-gray-200" />

        {/* Settings */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition-all hover:bg-gray-100 ${
              isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
            }`
          }
        >
          <SettingsIcon />
          <span>Settings</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 mt-2 rounded-lg transition-all hover:bg-gray-100 text-gray-700"
        >
          <LogoutIcon className="mr-3" />
          Log Out
        </button>
      </nav>
    </aside>
  );
}
