import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Temples from "./pages/Temples";
import Journey from "./pages/Journey";
import Seva from "./pages/Seva";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/temples" element={<Temples />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/seva" element={<Seva />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;