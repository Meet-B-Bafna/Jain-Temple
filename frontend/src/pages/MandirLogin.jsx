import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flower2,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CalendarDays,
  Clock,
  HeartHandshake,
} from "lucide-react";

import { loginMandir } from "../services/auth";

const PORTAL_FEATURES = [
  {
    icon: Clock,
    title: "Darshan timings",
    text: "Keep your temple's opening hours accurate for visitors.",
  },
  {
    icon: CalendarDays,
    title: "Events and festivals",
    text: "Share upcoming pooja, utsav and special occasions.",
  },
  {
    icon: HeartHandshake,
    title: "Seva and donations",
    text: "Update the seva options devotees can take part in.",
  },
];

function MandirLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginMandir(username, password);
      navigate("/mandir-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#211d18] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background image + overlay (same as the home hero) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/5/57/Guj21_Girnar_Ropeway_view_Jain_temples_Bhavnath.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#211d18]/90" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: welcome panel (desktop only) */}
        <div className="hidden text-white lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8c98d]/50 bg-black/25 px-4 py-2">
            <Flower2 size={15} className="text-[#e8c98d]" />
            <span className="text-xs font-semibold tracking-wide text-[#f4dfb8]">
              Mandir representative portal
            </span>
          </div>

          <h2 className="font-serif text-5xl leading-tight">
            Welcome back,
            <span className="mt-2 block italic text-[#e8c98d]">
              keeper of the temple.
            </span>
          </h2>

          <p className="mt-6 max-w-md leading-8 text-white/75">
            Sign in to manage your temple's page on Jain Darshan and help
            devotees plan a meaningful visit.
          </p>

          <ul className="mt-10 space-y-5">
            {PORTAL_FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e8c98d]/40 bg-white/10 text-[#e8c98d]">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-white/65">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: login card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-[#e9dfcc] bg-[#faf8f2] p-7 shadow-2xl shadow-black/40 sm:p-9">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#c18a43] to-[#a96b24] text-white shadow-lg shadow-[#a96b24]/30 ring-4 ring-[#f5f0e6]">
                <Flower2 size={30} />
              </div>

              <h1 className="font-serif text-3xl font-bold text-[#332719]">
                Mandir Login
              </h1>

              <p className="mt-2 text-sm text-[#777064]">
                Sign in to manage your temple.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="mandir-username"
                  className="mb-2 block text-sm font-semibold text-[#332719]"
                >
                  Temple username
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a96b24]/70"
                  />

                  <input
                    id="mandir-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#dfd3bd] bg-white py-3.5 pl-11 pr-4 text-[#332719] outline-none transition placeholder:text-[#b3a98f] focus:border-[#a96b24] focus:ring-4 focus:ring-[#a96b24]/15"
                    placeholder="Enter temple username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mandir-password"
                  className="mb-2 block text-sm font-semibold text-[#332719]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a96b24]/70"
                  />

                  <input
                    id="mandir-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#dfd3bd] bg-white py-3.5 pl-11 pr-12 text-[#332719] outline-none transition placeholder:text-[#b3a98f] focus:border-[#a96b24] focus:ring-4 focus:ring-[#a96b24]/15"
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#777064] transition hover:bg-[#f5f0e6] hover:text-[#a96b24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a96b24]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#a96b24] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#89551c] hover:shadow-lg hover:shadow-[#a96b24]/30 disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#777064]">
              Authorized mandir representatives only.
            </p>

            <div className="mt-5 border-t border-[#e9dfcc] pt-5 text-center">
              <Link
                to="/"
                className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#a96b24]"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MandirLogin;