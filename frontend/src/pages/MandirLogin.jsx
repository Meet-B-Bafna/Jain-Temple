import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flower2, LockKeyhole } from "lucide-react";

import { loginMandir } from "../services/auth";

function MandirLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-[80vh] items-center justify-center bg-[#f5f0e6] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e9dfcc] bg-[#faf8f2] p-8 shadow-sm">

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a96b24] text-white">
            <Flower2 size={32} />
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#332719]">
            Mandir Login
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Representative access portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Temple Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-[#dfd3bd] bg-white px-4 py-3 outline-none focus:border-[#a96b24]"
              placeholder="Enter temple username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#dfd3bd] bg-white py-3 pl-10 pr-4 outline-none focus:border-[#a96b24]"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#a96b24] py-3 font-semibold text-white transition hover:bg-[#89551c] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Authorized mandir representatives only.
        </p>

        <div className="mt-5 text-center">
          <Link to="/" className="text-sm text-[#a96b24] hover:underline">
            Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default MandirLogin;