// src/routes/AppRoutes.tsx
import { Routes, Route, Router } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LeadForm from "../components/leads/LeadForm";
import Applications from "../pages/Applications";
import Layout from "../layout/Layout";
import ProtectedRoute from "../utils/ProtectedRoute";
import Lap from "../pages/Products/Lap";
import Educationloan from "../pages/Products/Educationloan";
import Users from "../pages/users";
import Login from "../pages/Login";
import ContactTable from "../pages/Contacts/contacts";
import Supplychain from "../pages/Products/Supplychain";
import AdminDashboard from '../pages/Admin/Dashboard'
import Adminleads from '../pages/Admin/leads'
import Product from '../pages/Admin/Product'
import OutlookCalendar from "../pages/OutlookCalendar"
import OutlookIntegration from "../pages/OutlookIntegration"
import { Navigate } from "react-router-dom";

import CreateUser from '../pages/createUser'
const AppRoutes = () => {



    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            {/* admin page */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="admin">
                        <Layout role="admin" />
                    </ProtectedRoute>
                }
            >
                {/* All paths here are RELATIVE to /admin */}
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />    {/* /admin/dashboard */}
                <Route path="leads" element={<Adminleads />} />
                <Route path="products" element={<Product />} />
            </Route>

            {/* user page */}
            <Route
                path="/"
                element={
                    // <ProtectedRoute>
                    <Layout />
                    // </ProtectedRoute>
                }

            >
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create/users" element={<CreateUser />} />
                <Route path="leads/users" element={<Users />} />
                <Route path="leads/create" element={<LeadForm />} />
                {/* <Route path="leads/kyc" element={<KycForm />} /> */}
                <Route path="applications" element={<Applications />} />
                <Route path="/contacts" element={<ContactTable />} />

                <Route path="Product">
                    <Route path="lap" element={<Lap />} />
                    <Route path="supply-chain" element={<Supplychain />} />
                    <Route path="education-loan" element={<Educationloan />} />
                    <Route />
                </Route>
                <Route path="/integrations/outlook" element={<OutlookIntegration />} />
                <Route path="/calendar/outlook" element={<OutlookCalendar />} />

            </Route>
        </Routes>
    );
};

export default AppRoutes;
