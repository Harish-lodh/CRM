import { NavLink, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";


const Sidebar = () => {
  const navigate = useNavigate();

  const moduleItems = [{ id: "Pipelines", label: "Pipelines", path: "/leads/users" }];
  const productItems = [
    { id: "LAP", label: "Loan Against Property", path: "/Product/lap" },
    { id: "Supplychain", label: "Supply Chain", path: "/Product/supply-chain" },
    { id: "EducationLoan", label: "Education Loan", path: "/Product/education-loan" },
  ];

  const integrationItems = [
    {
      id: "outlookIntegration",
      label: "Microsoft Outlook",
      path: "/integrations/outlook",
    },
    {
      id: "outlookCalendar",
      label: "Outlook Calendar",
      path: "/calendar/outlook",
    },
  ];


  const otherItems = [
    { id: "settings", label: "Settings", path: "/settings", icon: SettingsIcon },
    { id: "logout", label: "Log Out", path: "/login", icon: LogoutIcon },
  ];

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const d = jwtDecode(token);
      setIsSuperAdmin(d.role?.toLowerCase() === "superadmin");
    } catch {
      setIsSuperAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className="
        flex flex-col
        h-full bg-white
        text-gray-700
      "
    >
      <nav className="flex-1 overflow-y-auto px-3 py-3 text-sm sm:text-base">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 sm:gap-3 w-full p-2 sm:p-3 rounded-lg transition-all hover:bg-gray-100 ${isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
            }`
          }
        >
          <DashboardIcon fontSize="small" />
          <span>Dashboard</span>
        </NavLink>

        <div className="mt-2">
          <div className="flex items-center justify-between w-full p-2 sm:p-3 font-semibold text-gray-700">
            <span className="flex items-center gap-2 sm:gap-3">
              <DynamicFormIcon fontSize="small" />
              Leads
            </span>
            <ArrowDropDownIcon fontSize="small" />
          </div>
          <div className="mt-1">
            {moduleItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center w-full p-2 sm:p-3 pl-8 sm:pl-10 mb-1 rounded-lg transition-all hover:bg-gray-100 ${isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
                  }`
                }
              >
                <ChevronRightIcon className="mr-2" fontSize="small" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {isSuperAdmin && (
          <NavLink
            to="/create/users"
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 w-full p-2 sm:p-3 mt-3 rounded-lg transition-all hover:bg-gray-100 ${isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
              }`
            }
          >
            <PersonAddIcon fontSize="small" />
            <span>Create user</span>
          </NavLink>
        )}

        <div className="mt-3">
          <div className="flex items-center justify-between w-full p-2 sm:p-3 font-semibold text-gray-700">
            <span className="flex items-center gap-2 sm:gap-3">
              <CategoryIcon fontSize="small" />
              Products
            </span>
            <ArrowDropDownIcon fontSize="small" />
          </div>
          <div className="mt-1">
            {productItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded-lg transition-all hover:bg-gray-100 ${isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
                  }`
                }
              >
                <ChevronRightIcon className="mr-2" fontSize="small" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        {/* ================= Integrations ================= */}
        <div className="mt-3">
          <div className="flex items-center justify-between w-full p-2 sm:p-3 font-semibold text-gray-700">
            <span className="flex items-center gap-2 sm:gap-3">
              <IntegrationInstructionsIcon fontSize="small" />
              Integrations
            </span>
            <ArrowDropDownIcon fontSize="small" />
          </div>

          <div className="mt-1">
            {integrationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded-lg transition-all hover:bg-gray-100 ${isActive
                    ? "text-blue-800 font-semibold bg-gray-50"
                    : "text-gray-700"
                  }`
                }
              >
                <ChevronRightIcon className="mr-2" fontSize="small" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>


        <hr className="my-4 border-gray-200" />

        {otherItems.map((item) =>
          item.id === "logout" ? (
            <button
              key={item.id}
              onClick={handleLogout}
              className="flex items-center w-full p-2 sm:p-3 rounded-lg transition-all hover:bg-gray-100 text-gray-700"
            >
              <item.icon className="mr-3 sm:mr-4" fontSize="small" />
              {item.label}
            </button>
          ) : (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center w-full p-2 sm:p-3 rounded-lg transition-all hover:bg-gray-100 ${isActive ? "text-blue-800 font-semibold bg-gray-50" : "text-gray-700"
                }`
              }
            >
              <item.icon className="mr-3 sm:mr-4" fontSize="small" />
              {item.label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;