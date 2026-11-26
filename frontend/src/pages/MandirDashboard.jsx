import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Flower2, Save, Pencil, X } from "lucide-react";

import { getCurrentRepresentative, logoutMandir } from "../services/auth";
import { getTempleById, updateMyTemple } from "../services/api";

function MandirDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    address: "",
    contact: "",
    morning_timings: "",
    evening_timings: "",
    facilities: "",
    history: "",
    main_deity: "",
    tradition: "",
    establishment_details: "",
    pratishtha_details: "",
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const representative = await getCurrentRepresentative();
        setUser(representative);

        const templeData = await getTempleById(
          representative.temple_id
        );

        setTemple(templeData);

        setForm({
          address: templeData.address || "",
          contact: templeData.contact || "",
          morning_timings: templeData.morning_timings || "",
          evening_timings: templeData.evening_timings || "",
          facilities: templeData.facilities || "",
          history: templeData.history || "",
          main_deity: templeData.main_deity || "",
          tradition: templeData.tradition || "",
          establishment_details: templeData.establishment_details || "",
          pratishtha_details: templeData.pratishtha_details || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  function handleLogout() {
    logoutMandir();
    navigate("/mandir-login", { replace: true });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await updateMyTemple(form);

      setTemple(result.temple);
      setEditing(false);
      setMessage("Temple information updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({
      address: temple.address || "",
      contact: temple.contact || "",
      morning_timings: temple.morning_timings || "",
      evening_timings: temple.evening_timings || "",
      facilities: temple.facilities || "",
      history: temple.history || "",
      main_deity: temple.main_deity || "",
      tradition: temple.tradition || "",
      establishment_details: temple.establishment_details || "",
      pratishtha_details: temple.pratishtha_details || "",
    });

    setEditing(false);
    setError("");
    setMessage("");
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error && !temple) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!temple) return null;

  const inputClass =
    "w-full rounded-lg border border-[#e9dfcc] bg-white px-4 py-3 text-sm outline-none focus:border-[#a96b24]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#5b4934]";

  function renderField(label, name, multiline = false) {
    return (
      <div>
        <label className={labelClass} htmlFor={name}>
          {label}
        </label>

        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            disabled={!editing}
            rows={4}
            className={`${inputClass} resize-y disabled:bg-[#f5f0e6]`}
          />
        ) : (
          <input
            id={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            disabled={!editing}
            className={`${inputClass} disabled:bg-[#f5f0e6]`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e6] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#a96b24]">
              Representative Portal
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold text-[#332719]">
              Welcome
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your temple information.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-[#a96b24] px-5 py-3 text-sm font-semibold text-[#a96b24] hover:bg-[#a96b24] hover:text-white"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-green-100 p-4 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-[#e9dfcc] bg-[#faf8f2] p-6 shadow-sm sm:p-8">

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a96b24] text-white">
              <Flower2 size={28} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Your Registered Temple
              </p>

              <h2 className="font-serif text-xl font-bold text-[#332719]">
                {temple.name}
              </h2>
            </div>
          </div>

          <div className="grid gap-5 border-t border-[#e9dfcc] pt-6 sm:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">Temple ID</p>
              <p className="mt-1 font-semibold">{user.temple_id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Representative Username</p>
              <p className="mt-1 font-semibold">{user.username}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">Registered Temple Name</p>
              <p className="mt-1 font-semibold">{temple.name}</p>
            </div>

          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#e9dfcc] bg-[#faf8f2] p-6 shadow-sm sm:p-8">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#332719]">
                Temple Management
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Update your temple's information for visitors.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={() => {
                  setEditing(true);
                  setMessage("");
                  setError("");
                }}
                className="flex items-center gap-2 rounded-full bg-[#a96b24] px-5 py-3 text-sm font-semibold text-white hover:bg-[#89551c]"
              >
                <Pencil size={16} />
                Edit Information
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-full border border-gray-400 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div className="grid gap-6 sm:grid-cols-2">

              {renderField("Address", "address")}
              {renderField("Contact Number", "contact")}
              {renderField("Morning Timings", "morning_timings")}
              {renderField("Evening Timings", "evening_timings")}
              {renderField("Main Deity / Moolnayak", "main_deity")}
              {renderField("Jain Tradition", "tradition")}
              {renderField("Establishment Details", "establishment_details", true)}
              {renderField("Pratishtha Details", "pratishtha_details", true)}

              <div className="sm:col-span-2">
                {renderField("Temple Facilities", "facilities", true)}
              </div>

              <div className="sm:col-span-2">
                {renderField("Temple History", "history", true)}
              </div>

            </div>

            {editing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-[#a96b24] px-7 py-3 font-semibold text-white hover:bg-[#89551c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 rounded-lg bg-[#f5f0e6] p-4 text-sm text-[#89551c]">
            Your account is linked to Temple {user.temple_id}.
            You cannot change the temple name, Temple ID, Google Maps
            location or coordinates.
          </div>

        </div>
      </div>
    </div>
  );
}

export default MandirDashboard;
