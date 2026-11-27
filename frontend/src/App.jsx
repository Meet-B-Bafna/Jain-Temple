import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Temples from "./pages/Temples";
import TempleDetails from "./pages/TempleDetails";
import Journey from "./pages/Journey";
import Seva from "./pages/Seva";
import About from "./pages/About";

import MandirLogin from "./pages/MandirLogin";
import MandirDashboard from "./pages/MandirDashboard";

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";  

import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/temples" element={<Temples />} />
          <Route path="/temples/:templeId" element={<TempleDetails />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/seva" element={<Seva />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/mandir-login" element={<MandirLogin />} />

          <Route
          path="/admin-dashboard"
          element={
          <AdminProtectedRoute>
            <AdminDashboard />
            </AdminProtectedRoute>
          }
          />

          <Route
            path="/mandir-dashboard"
            element={
              <ProtectedRoute>
                <MandirDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;