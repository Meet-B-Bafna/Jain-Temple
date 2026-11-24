import { useState } from "react";
import { Menu, X, Flower2, ArrowRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Explore Temples", path: "/temples" },
    { name: "My Darshan", path: "/journey" },
    { name: "Seva", path: "/seva" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e9dfcc] bg-[#faf8f2]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a96b24] text-white">
            <Flower2 size={25} />
          </div>

          <div>
            <h1 className="font-serif text-xl font-bold">Jain Darshan</h1>
            <p className="text-[10px] uppercase tracking-[3px] text-[#a96b24]">
              Lonavala
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-[#a96b24]"
                  : "transition hover:text-[#a96b24]"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <Link
          to="/temples"
          className="hidden rounded-full bg-[#a96b24] px-5 py-3 text-sm font-semibold text-white md:block"
        >
          Begin Darshan <ArrowRight className="ml-1 inline" size={16} />
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-12 w-12 items-center justify-center md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e9dfcc] bg-[#faf8f2] px-6 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block border-b border-[#e9dfcc] py-4 text-base ${
                  isActive ? "font-bold text-[#a96b24]" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;