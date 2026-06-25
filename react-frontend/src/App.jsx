import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

// Admin pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Subscriptions from "./pages/Subscriptions";
import APIKeys from "./pages/APIKeys";

// Client pages (teammate's)
import ClientDashboard from "./pages/ClientDashboard";
import Profile from "./pages/Profile";
import SubscriptionPage from "./pages/SubscriptionPage";
import Transactions from "./pages/Transactions";
import Apidocs from "./pages/Apidocs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/api-keys" element={<APIKeys />} />

        {/* Client */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/api-docs" element={<Apidocs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;