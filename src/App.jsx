import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientDashboard from "./pages/ClientDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import ApiDocs from "./pages/ApiDocs";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/subscribe" element={<SubscriptionPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/api-docs" element={<ApiDocs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;