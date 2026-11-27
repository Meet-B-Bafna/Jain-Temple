import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  RefreshCw,
  X,
  Save,
  Building2,
  Search,
  MapPin,
  ShieldCheck,
  Map,
  Image,
} from "lucide-react";

import { logoutAdmin } from "../services/auth";
import {
  getAdminTemples,
  createTemple,
  updateTemple,
  deleteTemple,
} from "../services/api";

const emptyTemple = {
  temple_id: "",
  name: "",
  address: "",
  contact: "",
  morning_timings: "",
  evening_timings: "",
  main_deity: "",
  tradition: "",
  history: "",
  establishment_details: "",
  pratishtha_details: "",
  facilities: "",
  maps_url: "",
  maps_search: "",
  latitude: "",
  longitude: "",
  image_url: "",
  image_source: "",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemple, setEditingTemple] = useState(null);
  const [form, setForm] = useState(emptyTemple);
  const [saving, setSaving] = useState(false);

  async function loadTemples() {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminTemples();
      setTemples(data);
    } catch (err) {
      setError(err.message || "Unable to load temples");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTemples();
  }, []);

  function openAddModal() {
    setError("");
    setEditingTemple(null);
    setForm({ ...emptyTemple });
    setModalOpen(true);
  }

  function openEditModal(temple) {
    setError("");
    setEditingTemple(temple);

    const templeForm = {};

    Object.keys(emptyTemple).forEach((key) => {
      templeForm[key] = temple[key] ?? "";
    });

    setForm(templeForm);
    setModalOpen(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = Object.fromEntries(
      Object.keys(emptyTemple).map((key) => [
        key,
        form[key] ?? "",
      ])
    );

    payload.latitude =
      payload.latitude === "" ? null : Number(payload.latitude);

    payload.longitude =
      payload.longitude === "" ? null : Number(payload.longitude);

    try {
      if (editingTemple) {
        delete payload.temple_id;
        await updateTemple(editingTemple.temple_id, payload);
      } else {
        await createTemple(payload);
      }

      setModalOpen(false);
      await loadTemples();
    } catch (err) {
      setError(err.message || "Unable to save temple");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(temple) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${temple.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteTemple(temple.temple_id);
      await loadTemples();
    } catch (err) {
      setError(err.message || "Unable to delete temple");
    }
  }

  function handleLogout() {
    logoutAdmin();
    navigate("/admin-login", { replace: true });
  }

  const filteredTemples = temples.filter((temple) => {
    const query = search.toLowerCase();

    return (
      temple.name?.toLowerCase().includes(query) ||
      temple.temple_id?.toLowerCase().includes(query) ||
      temple.address?.toLowerCase().includes(query)
    );
  });

  const inputClass =
    "w-full rounded-xl border border-[#ded3c3] bg-white px-4 py-3 text-sm text-[#332719] outline-none transition placeholder:text-gray-400 focus:border-[#a96b24] focus:ring-4 focus:ring-[#a96b24]/10";

  const textareaClass = `${inputClass} min-h-[105px] resize-y`;

  const fields = [
    ["name", "Temple Name", true],
    ["address", "Address"],
    ["contact", "Contact Number"],
    ["morning_timings", "Morning Timings"],
    ["evening_timings", "Evening Timings"],
    ["main_deity", "Main Deity"],
    ["tradition", "Tradition"],
    ["history", "History"],
    ["establishment_details", "Establishment Details"],
    ["pratishtha_details", "Pratishtha Details"],
    ["facilities", "Facilities"],
    ["maps_url", "Google Maps URL"],
    ["maps_search", "Google Maps Search URL"],
    ["latitude", "Latitude"],
    ["longitude", "Longitude"],
    ["image_url", "Image URL"],
    ["image_source", "Image Source"],
  ];

  function renderFields(fieldNames) {
    return fields
      .filter(([name]) => fieldNames.includes(name))
      .map(([name, label, required]) => {
        const isTextarea = [
          "history",
          "establishment_details",
          "pratishtha_details",
          "facilities",
        ].includes(name);

        return (
          <div key={name}>
            <label className="mb-2 block text-sm font-semibold text-[#55432d]">
              {label}
              {required ? " *" : ""}
            </label>

            {isTextarea ? (
              <textarea
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                rows={3}
                required={Boolean(required)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                className={textareaClass}
              />
            ) : (
              <input
                name={name}
                type={
                  name === "latitude" || name === "longitude"
                    ? "number"
                    : "text"
                }
                step={
                  name === "latitude" || name === "longitude"
                    ? "any"
                    : undefined
                }
                value={form[name] ?? ""}
                onChange={handleChange}
                required={Boolean(required)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                className={inputClass}
              />
            )}
          </div>
        );
      });
  }

  return (
    <div className="min-h-screen bg-[#f5f1e9]">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#332719] px-5 py-5 text-white shadow-lg sm:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#a96b24] p-3">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Administrator Dashboard
            </h1>
            <p className="text-sm text-[#e4d5bd]">
              Lonavala Jain Darshan
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-[#b99a70] px-4 py-2 text-sm transition hover:bg-[#a96b24]"
        >
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#a96b24]">
              <LayoutDashboard size={20} />
              <span className="text-sm font-semibold">
                ADMINISTRATION
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-[#332719]">
              Temple Management
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Manage temple information and records.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-[#a96b24] px-5 py-3 font-semibold text-white transition hover:bg-[#89551c]"
          >
            <Plus size={19} />
            Add New Temple
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e7ddce] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Temples</p>
                <h3 className="mt-2 text-3xl font-bold text-[#332719]">
                  {temples.length}
                </h3>
              </div>

              <div className="rounded-xl bg-[#f5eadb] p-3 text-[#a96b24]">
                <Building2 size={27} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e7ddce] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Displayed Results</p>
                <h3 className="mt-2 text-3xl font-bold text-[#332719]">
                  {filteredTemples.length}
                </h3>
              </div>

              <div className="rounded-xl bg-[#f5eadb] p-3 text-[#a96b24]">
                <Search size={27} />
              </div>
            </div>
          </div>
        </div>

        {error && !modalOpen && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-[#e7ddce] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee5d9] p-5">
            <h3 className="font-bold text-[#332719]">All Temples</h3>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search temples..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-[#ded3c3] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#a96b24] sm:w-64"
                />
              </div>

              <button
                onClick={loadTemples}
                className="rounded-lg border border-[#ded3c3] p-2 text-[#76532c] hover:bg-[#faf6ef]"
                title="Refresh"
              >
                <RefreshCw size={19} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading temples...
            </div>
          ) : filteredTemples.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No temples found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#faf7f1] text-[#76532c]">
                  <tr>
                    <th className="px-5 py-4">Temple</th>
                    <th className="px-5 py-4">Temple ID</th>
                    <th className="px-5 py-4">Address</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5d9]">
                  {filteredTemples.map((temple) => (
                    <tr
                      key={temple.temple_id}
                      className="transition hover:bg-[#fdfbf7]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#332719]">
                        {temple.name}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md bg-[#f5eadb] px-2 py-1 font-medium text-[#89551c]">
                          {temple.temple_id}
                        </span>
                      </td>

                      <td className="max-w-xs px-5 py-4 text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="mt-0.5 shrink-0" />
                          <span>{temple.address || "Not provided"}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {temple.contact || "Not provided"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(temple)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                            title="Edit Temple"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(temple)}
                            className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100"
                            title="Delete Temple"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17120d]/65 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#e8ddcc] bg-[#faf8f2] shadow-2xl">

            <div className="flex shrink-0 items-center justify-between bg-[#332719] px-5 py-4 text-white sm:px-8 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#a96b24] p-3">
                  <Building2 size={23} />
                </div>

                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    {editingTemple ? "Edit Temple" : "Add New Temple"}
                  </h3>
                  <p className="mt-1 text-xs text-[#e4d5bd] sm:text-sm">
                    Manage temple information and details.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !saving && setModalOpen(false)}
                disabled={saving}
                className="rounded-xl p-2 transition hover:bg-white/10 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={23} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">

                {error && (
                  <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={() => setError("")}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {!editingTemple && (
                  <section className="mb-7">
                    <div className="mb-4">
                      <h4 className="font-bold text-[#332719]">
                        Temple Identification
                      </h4>
                      <p className="mt-1 text-xs text-gray-500">
                        Assign a unique ID to this temple.
                      </p>
                    </div>

                    <div className="max-w-md">
                      <label className="mb-2 block text-sm font-semibold text-[#55432d]">
                        Temple ID *
                      </label>

                      <input
                        name="temple_id"
                        value={form.temple_id}
                        onChange={handleChange}
                        placeholder="Example: 10"
                        required
                        className={inputClass}
                      />
                    </div>
                  </section>
                )}

                <section className="mb-8">
                  <div className="mb-4 flex items-center gap-3 border-b border-[#e8ddcc] pb-3">
                    <div className="rounded-lg bg-[#f1e5d4] p-2 text-[#a96b24]">
                      <Building2 size={19} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#332719]">
                        Basic Information
                      </h4>
                      <p className="text-xs text-gray-500">
                        Temple name, contact and daily timings.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {renderFields([
                      "name",
                      "address",
                      "contact",
                      "morning_timings",
                      "evening_timings",
                      "main_deity",
                      "tradition",
                    ])}
                  </div>
                </section>

                <section className="mb-8">
                  <div className="mb-4 flex items-center gap-3 border-b border-[#e8ddcc] pb-3">
                    <div className="rounded-lg bg-[#f1e5d4] p-2 text-[#a96b24]">
                      <LayoutDashboard size={19} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#332719]">
                        History & Establishment
                      </h4>
                      <p className="text-xs text-gray-500">
                        Historical and religious information.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {renderFields([
                      "history",
                      "establishment_details",
                      "pratishtha_details",
                      "facilities",
                    ])}
                  </div>
                </section>

                <section className="mb-8">
                  <div className="mb-4 flex items-center gap-3 border-b border-[#e8ddcc] pb-3">
                    <div className="rounded-lg bg-[#f1e5d4] p-2 text-[#a96b24]">
                      <Map size={19} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#332719]">
                        Location & Google Maps
                      </h4>
                      <p className="text-xs text-gray-500">
                        Map links and geographical coordinates.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {renderFields([
                      "maps_url",
                      "maps_search",
                      "latitude",
                      "longitude",
                    ])}
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex items-center gap-3 border-b border-[#e8ddcc] pb-3">
                    <div className="rounded-lg bg-[#f1e5d4] p-2 text-[#a96b24]">
                      <Image size={19} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#332719]">
                        Temple Images
                      </h4>
                      <p className="text-xs text-gray-500">
                        Add the image URL and its source.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {renderFields(["image_url", "image_source"])}
                  </div>
                </section>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#e8ddcc] bg-white px-5 py-4 sm:px-8">
                <p className="hidden text-xs text-gray-500 sm:block">
                  Please verify the information before saving.
                </p>

                <div className="ml-auto flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                    className="rounded-xl border border-[#d8cbb8] px-5 py-3 text-sm font-semibold text-[#55432d] transition hover:bg-[#faf6ef] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#a96b24] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#89551c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />
                    {saving ? "Saving..." : "Save Temple"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;