import { useState } from "react";
import {
  Menu,
  X,
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
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
          <img
            src="/jain flag.jpg"
            alt="Jain flag"
            className="h-11 w-11 rounded-full border-2 border-[#a96b24] object-cover object-center"
          />

          <div>
            <h1 className="font-serif text-xl font-bold">Jain Darshan</h1>
            <p className="text-[10px] uppercase tracking-[3px] text-[#a96b24]">
              Lonavala
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
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

          <NavLink
            to="/mandir-login"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "font-bold text-[#a96b24]"
                  : "transition hover:text-[#a96b24]"
              }`
            }
          >
            <LockKeyhole size={16} />
            Mandir Login
          </NavLink>

          <NavLink
            to="/admin-login"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full border px-4 py-2 transition ${
                isActive
                  ? "border-[#a96b24] bg-[#a96b24] text-white"
                  : "border-[#a96b24] text-[#89551c] hover:bg-[#a96b24] hover:text-white"
              }`
            }
          >
            <ShieldCheck size={16} />
            Admin
          </NavLink>
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

          <NavLink
            to="/mandir-login"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b border-[#e9dfcc] py-4 text-base ${
                isActive ? "font-bold text-[#a96b24]" : ""
              }`
            }
          >
            <LockKeyhole size={17} />
            Mandir Login
          </NavLink>

          <NavLink
            to="/admin-login"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 py-4 text-base ${
                isActive ? "font-bold text-[#a96b24]" : ""
              }`
            }
          >
            <ShieldCheck size={17} />
            Admin Login
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;