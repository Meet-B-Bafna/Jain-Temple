import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Save,
  Pencil,
  X,
  MapPin,
  Sunrise,
  Sunset,
  Landmark,
  BookOpen,
  Building2,
  Lock,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { getCurrentRepresentative, logoutMandir } from "../services/auth";
import { getTempleById, updateMyTemple } from "../services/api";

/* ---------- Form layout (limits match the backend) ---------- */

const SECTIONS = [
  {
    title: "Contact & Location",
    subtitle: "How devotees find and reach your temple",
    icon: MapPin,
    fields: [
      { name: "address", label: "Address", max: 500, rows: 3, multiline: true, wide: true },
      { name: "contact", label: "Contact Number", max: 200 },
    ],
  },
  {
    title: "Darshan Timings",
    subtitle: "Daily opening hours for visitors",
    icon: Sunrise,
    fields: [
      { name: "morning_timings", label: "Morning Timings", max: 200, icon: Sunrise },
      { name: "evening_timings", label: "Evening Timings", max: 200, icon: Sunset },
    ],
  },
  {
    title: "About the Temple",
    subtitle: "Who is worshipped here and in which tradition",
    icon: Landmark,
    fields: [
      { name: "main_deity", label: "Main Deity / Moolnayak", max: 300 },
      { name: "tradition", label: "Jain Tradition", max: 200 },
    ],
  },
  {
    title: "Heritage & History",
    subtitle: "The story behind the temple",
    icon: BookOpen,
    fields: [
      { name: "establishment_details", label: "Establishment Details", max: 2000, rows: 4, multiline: true },
      { name: "pratishtha_details", label: "Pratishtha Details", max: 2000, rows: 4, multiline: true },
      { name: "history", label: "Temple History", max: 5000, rows: 6, multiline: true, wide: true },
    ],
  },
  {
    title: "Facilities",
    subtitle: "Dharamshala, bhojanshala, parking and more",
    icon: Building2,
    fields: [
      { name: "facilities", label: "Temple Facilities", max: 2000, rows: 4, multiline: true, wide: true },
    ],
  },
];

const FIELD_KEYS = SECTIONS.flatMap((section) =>
  section.fields.map((field) => field.name)
);

function toForm(templeData) {
  const result = {};

  FIELD_KEYS.forEach((key) => {
    result[key] = templeData?.[key] || "";
  });

  return result;
}

function formatDate(value) {
  if (!value) return "Not updated yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not updated yet";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---------- Page ---------- */

function MandirDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(() => toForm(null));

  useEffect(() => {
    async function loadDashboard() {
      try {
        const representative = await getCurrentRepresentative();
        setUser(representative);

        const templeData = await getTempleById(representative.temple_id);

        setTemple(templeData);
        setForm(toForm(templeData));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  // Success message disappears by itself.
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 5000);

    return () => clearTimeout(timer);
  }, [message]);

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
    setForm(toForm(temple));
    setEditing(false);
    setError("");
    setMessage("");
  }

  /* ----- Loading and error states ----- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-56 rounded-3xl bg-[#e9dfcc]" />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-28 rounded-2xl bg-[#e9dfcc]" />
            <div className="h-28 rounded-2xl bg-[#e9dfcc]" />
            <div className="h-28 rounded-2xl bg-[#e9dfcc]" />
          </div>

          <div className="h-72 rounded-2xl bg-[#e9dfcc]" />
        </div>
      </div>
    );
  }

  if (error && !temple) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <AlertCircle className="text-red-500" size={40} />

        <p className="max-w-md text-red-600">{error}</p>

        <button
          onClick={handleLogout}
          className="rounded-full bg-[#a96b24] px-7 py-3 text-sm font-semibold text-white hover:bg-[#89551c]"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (!temple) return null;

  /* ----- Derived values ----- */

  const hasChanges = FIELD_KEYS.some(
    (key) => (form[key] || "") !== (temple[key] || "")
  );

  const filledCount = FIELD_KEYS.filter((key) =>
    String(temple[key] || "").trim()
  ).length;

  const completion = Math.round((filledCount / FIELD_KEYS.length) * 100);

  const inputClass =
    "w-full rounded-xl border border-[#e9dfcc] bg-white px-4 py-3 text-sm text-[#332719] outline-none transition placeholder:text-[#b3a791] focus:border-[#a96b24] focus:ring-4 focus:ring-[#a96b24]/10 disabled:bg-[#f5f0e6] disabled:text-[#5b4934]";

  function renderField(field) {
    const FieldIcon = field.icon;
    const value = form[field.name];

    return (
      <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
        <label
          htmlFor={field.name}
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5b4934]"
        >
          {FieldIcon && <FieldIcon size={15} className="text-[#a96b24]" />}
          {field.label}
        </label>

        {field.multiline ? (
          <textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            disabled={!editing}
            rows={field.rows}
            maxLength={field.max}
            placeholder={editing ? "Write here..." : "Not added yet"}
            className={`${inputClass} resize-y`}
          />
        ) : (
          <input
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            disabled={!editing}
            maxLength={field.max}
            placeholder={editing ? "Write here..." : "Not added yet"}
            className={inputClass}
          />
        )}

        {editing && field.multiline && (
          <p className="mt-1 text-right text-xs text-[#a39785]">
            {value.length} / {field.max}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e6] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-[#332719] text-white shadow-lg">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('/palitana.jpg')" }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#211d18]/95 via-[#332719]/80 to-[#332719]/30" />

          <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 p-6 sm:p-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e8c98d]/50 bg-black/25 px-4 py-1.5">
                <Sparkles size={14} className="text-[#e8c98d]" />

                <span className="text-xs font-semibold uppercase tracking-widest text-[#f4dfb8]">
                  Representative Portal
                </span>
              </div>

              <p className="mt-5 font-serif text-xl italic text-[#e8c98d]">
                Jai Jinendra, {user.username}
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                {temple.name}
              </h1>

              <p className="mt-3 text-sm text-white/70">
                Keep your temple's information accurate for every devotee
                who visits.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/temples/${user.temple_id}`}
                className="flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <ExternalLink size={16} />
                View Public Page
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-[#c18a43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a96b24]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e9dfcc] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a96b24]/10 text-[#a96b24]">
                <Landmark size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#8a7e6a]">
                  Temple ID
                </p>
                <p className="mt-0.5 font-serif text-xl font-bold text-[#332719]">
                  {user.temple_id}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9dfcc] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a96b24]/10 text-[#a96b24]">
                <Clock size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#8a7e6a]">
                  Last Updated
                </p>
                <p className="mt-0.5 font-serif text-xl font-bold text-[#332719]">
                  {formatDate(temple.updated_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9dfcc] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-[#8a7e6a]">
                Profile Completeness
              </p>

              <p className="font-serif text-xl font-bold text-[#a96b24]">
                {completion}%
              </p>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#f0e8d8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#c18a43] to-[#a96b24] transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-[#8a7e6a]">
              {filledCount} of {FIELD_KEYS.length} details filled
            </p>
          </div>
        </section>

        {/* MESSAGES */}
        {message && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 size={19} className="shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="shrink-0" />
            {error}
          </div>
        )}

        {/* MANAGEMENT HEADER */}
        <div className="mb-5 mt-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#332719] sm:text-3xl">
              Temple Management
            </h2>

            <p className="mt-1 text-sm text-[#665f54]">
              {editing
                ? "You are editing. Remember to save your changes."
                : "Press Edit Information to update your temple's details."}
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setMessage("");
                setError("");
              }}
              className="flex items-center gap-2 rounded-full bg-[#a96b24] px-6 py-3 text-sm font-semibold text-white shadow transition duration-300 hover:-translate-y-0.5 hover:bg-[#89551c] hover:shadow-lg"
            >
              <Pencil size={16} />
              Edit Information
            </button>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} className="space-y-6">
          {SECTIONS.map((section) => {
            const SectionIcon = section.icon;

            return (
              <section
                key={section.title}
                className={`rounded-2xl border bg-[#faf8f2] p-6 shadow-sm transition sm:p-8 ${
                  editing ? "border-[#a96b24]/40" : "border-[#e9dfcc]"
                }`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#a96b24] text-white">
                    <SectionIcon size={22} />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#332719]">
                      {section.title}
                    </h3>

                    <p className="text-sm text-[#8a7e6a]">{section.subtitle}</p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {section.fields.map(renderField)}
                </div>
              </section>
            );
          })}

          {/* SAVE BAR */}
          {editing && (
            <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e9dfcc] bg-white/95 p-4 shadow-xl backdrop-blur">
              <p
                className={`flex items-center gap-2 text-sm font-medium ${
                  hasChanges ? "text-[#a96b24]" : "text-[#8a7e6a]"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    hasChanges ? "bg-[#c18a43]" : "bg-[#d8cfbd]"
                  }`}
                />
                {hasChanges ? "You have unsaved changes" : "No changes yet"}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="flex items-center gap-2 rounded-full bg-[#a96b24] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#89551c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* LOCKED FIELDS */}
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#e9dfcc] bg-white p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5f0e6] text-[#89551c]">
            <Lock size={20} />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#332719]">
              Protected Information
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#665f54]">
              Your account is linked to Temple {user.temple_id}. For
              accuracy and safety, these details can only be changed by the
              site administrator.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Temple Name",
                "Temple ID",
                "Google Maps Location",
                "Coordinates",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#f5f0e6] px-4 py-1.5 text-xs font-semibold text-[#89551c]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default MandirDashboard;