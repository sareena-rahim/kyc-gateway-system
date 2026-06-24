import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Subscriptions from "./pages/Subscriptions";
import ClientDashboard from "./pages/ClientDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import ApiDocs from "./pages/Apidocs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/subscribe" element={<SubscriptionPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/api-docs" element={<ApiDocs />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
