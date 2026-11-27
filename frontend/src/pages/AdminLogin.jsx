import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";
import { loginAdmin } from "../services/auth";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(username, password);
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#211d18] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#faf8f2] shadow-2xl">

        <div className="bg-[#332719] px-8 py-10 text-center text-[#faf8f2]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a96b24]">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-2xl font-bold">
            Administrator Portal
          </h1>

          <p className="mt-2 text-sm text-[#e4d5bd]">
            Lonavala Jain Darshan
          </p>
        </div>

        <div className="px-8 py-8">
          <h2 className="text-xl font-semibold text-[#332719]">
            Admin Sign In
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Sign in to manage temple information and representatives.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#332719]">
                Admin Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-[#d8cbb8] bg-white px-4 py-3 outline-none transition focus:border-[#a96b24] focus:ring-2 focus:ring-[#a96b24]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#332719]">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-[#d8cbb8] bg-white py-3 pl-10 pr-12 outline-none transition focus:border-[#a96b24] focus:ring-2 focus:ring-[#a96b24]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#a96b24]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#a96b24] py-3 font-semibold text-white transition hover:bg-[#89551c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={19} />
              {loading ? "Signing in..." : "Sign In as Admin"}
            </button>

          </form>

          <div className="mt-7 border-t border-[#e5dccd] pt-5">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-sm font-medium text-[#8b5b27] hover:text-[#332719]"
            >
              <ArrowLeft size={16} />
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
