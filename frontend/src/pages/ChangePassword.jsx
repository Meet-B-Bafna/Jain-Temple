import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Flower2 } from "lucide-react";

import { changeMandirPassword, logoutMandir } from "../services/auth";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 12) {
      setError("New password must contain at least 12 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await changeMandirPassword(currentPassword, newPassword);
      navigate("/mandir-dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutMandir();
    navigate("/mandir-login");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#f5f0e6] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e9dfcc] bg-[#faf8f2] p-8 shadow-sm">

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a96b24] text-white">
            <Flower2 size={32} />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#332719]">
            Change Your Password
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Please set a new password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Temporary Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[#dfd3bd] bg-white px-4 py-3 outline-none focus:border-[#a96b24]"
              placeholder="Enter temporary password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              New Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={12}
                maxLength={128}
                className="w-full rounded-lg border border-[#dfd3bd] bg-white py-3 pl-10 pr-4 outline-none focus:border-[#a96b24]"
                placeholder="Minimum 12 characters"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              maxLength={128}
              className="w-full rounded-lg border border-[#dfd3bd] bg-white px-4 py-3 outline-none focus:border-[#a96b24]"
              placeholder="Confirm new password"
            />
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
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

        <button
          onClick={handleLogout}
          className="mt-5 w-full text-sm text-gray-500 hover:text-[#a96b24]"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default ChangePassword;