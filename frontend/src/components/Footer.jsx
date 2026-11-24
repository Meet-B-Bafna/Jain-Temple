import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#211c16] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
        <div>
          <h2 className="font-serif text-2xl font-bold">
            Lonavala Jain Darshan
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-7 text-white/60">
            Discover the sacred Jain heritage of Lonavala through one
            digital platform.
          </p>
        </div>

        <div className="flex flex-wrap gap-7 text-sm text-white/60">
          <Link to="/">Home</Link>
          <Link to="/temples">Temples</Link>
          <Link to="/journey">My Darshan</Link>
          <Link to="/seva">Seva</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-7 text-center text-xs text-white/40">
        © 2026 Lonavala Jain Darshan. A digital Jain heritage initiative.
      </div>
    </footer>
  );
}

export default Footer;