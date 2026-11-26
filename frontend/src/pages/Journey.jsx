import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Award,
  Download,
  Lock,
  Check,
  Landmark,
  QrCode,
  Trophy,
  ScrollText,
} from "lucide-react";

import { getVisitedTemples } from "../services/darshan";
import { getEarnedTier, downloadCertificate } from "../utils/certificate";

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;
const TOTAL_TEMPLES = 10;

/* ---------- Content ---------- */

const STEPS = [
  {
    icon: Landmark,
    title: "Visit Temples",
    text: "Visit sacred Jain temples across Lonavala.",
  },
  {
    icon: QrCode,
    title: "Scan QR Codes",
    text: "Scan each temple's QR code to record your visit.",
  },
  {
    icon: Trophy,
    title: "Unlock Achievements",
    text: "Reach Bronze, Silver and Elite Darshan milestones.",
  },
  {
    icon: ScrollText,
    title: "Get Certificates",
    text: "Download your digital certificate as a PDF.",
  },
];

const MILESTONES = [
  {
    key: "bronze",
    threshold: 3,
    label: "Bronze",
    title: "Bronze Darshan",
    subtitle: "First milestone",
    color: "#c9803c",
  },
  {
    key: "silver",
    threshold: 5,
    label: "Silver",
    title: "Silver Darshan",
    subtitle: "A growing journey",
    color: "#a9b6cc",
  },
  {
    key: "elite",
    threshold: 10,
    label: "Elite",
    title: "Complete Jain Darshan",
    subtitle: "Special achievement",
    color: "#e8bd62",
  },
];

// Colours of the small certificate preview (match the PDF designs).
const PREVIEW_THEMES = {
  bronze: { bg: "#fefbf5", border: "#70421c", accent: "#b87333", text: "#332416", name: "#70421c" },
  silver: { bg: "#fbfcfe", border: "#465470", accent: "#808ea6", text: "#1a243a", name: "#2c4270" },
  elite: { bg: "#2c1115", border: "#d6ac54", accent: "#d6ac54", text: "#fae8b0", name: "#f0c864" },
};

const RING_RADIUS = 54;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/* ---------- Page ---------- */

function Journey() {
  const certificateRef = useRef(null);

  const [visitedCount] = useState(() => getVisitedTemples().length);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  const earnedTier = getEarnedTier(visitedCount);
  const shownCount = Math.min(visitedCount, TOTAL_TEMPLES);

  const nextMilestone = MILESTONES.find(
    (milestone) => visitedCount < milestone.threshold
  );

  const pathFill = Math.max(0, shownCount - 1) / (TOTAL_TEMPLES - 1);

  function scrollToCertificate() {
    certificateRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleDownload(event) {
    event.preventDefault();

    if (!earnedTier) return;

    const cleanedName = name.trim().replace(/\s+/g, " ");

    if (cleanedName.length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!NAME_PATTERN.test(cleanedName)) {
      setError("Please enter your name using English letters only.");
      return;
    }

    setError("");
    setGenerating(true);

    try {
      await downloadCertificate({ name: cleanedName, tier: earnedTier });
    } catch {
      setError("Could not create the certificate. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const previewTheme = earnedTier ? PREVIEW_THEMES[earnedTier.key] : null;
  const previewName = name.trim() || "Your Name";

  return (
    <main className="min-h-screen bg-[#29251f] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/palitana.jpg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#211d18]/70 via-[#29251f]/80 to-[#29251f]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 md:grid-cols-[1.2fr_1fr]">

          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8bd78]/40 bg-black/25 px-4 py-1.5">
              <Sparkles size={14} className="text-[#e8bd78]" />

              <span className="text-xs font-bold uppercase tracking-[3px] text-[#e8bd78]">
                Your Spiritual Experience
              </span>
            </div>

            <h1 className="font-serif text-4xl leading-tight sm:text-6xl">
              Begin Your Own
              <span className="block italic text-[#e8bd78]">
                Jain Darshan Journey.
              </span>
            </h1>

            <p className="mt-7 max-w-xl leading-8 text-white/70">
              Visit Jain temples across Lonavala, scan their unique QR codes
              and keep track of your spiritual journey.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/temples"
                className="group flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#c18a43] px-8 text-base font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-[#a96b24] hover:shadow-lg hover:shadow-black/30"
              >
                Start My Journey
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <button
                type="button"
                onClick={scrollToCertificate}
                className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 text-base font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Award size={18} />
                My Certificate
              </button>
            </div>
          </div>

          {/* Progress ring */}
          <div className="mx-auto w-full max-w-sm rounded-3xl border border-[#c18a43]/30 bg-white/[0.05] p-8 text-center backdrop-blur">
            <div className="relative mx-auto h-48 w-48">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                />

                <circle
                  cx="70"
                  cy="70"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#c18a43"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={RING_LENGTH}
                  strokeDashoffset={RING_LENGTH * (1 - shownCount / TOTAL_TEMPLES)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-serif text-5xl font-bold text-[#e8bd78]">
                  {shownCount}
                </p>

                <p className="text-sm text-white/55">of {TOTAL_TEMPLES} temples</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-white/70">
              {nextMilestone
                ? `${nextMilestone.threshold - visitedCount} more ${
                    nextMilestone.threshold - visitedCount === 1
                      ? "temple"
                      : "temples"
                  } to reach ${nextMilestone.label} Darshan`
                : "You have completed the entire Jain Darshan!"}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">

        {/* JOURNEY PATH */}
        <section className="rounded-3xl border border-[#c18a43]/25 bg-white/[0.04] p-6 sm:p-10">
          <h2 className="font-serif text-2xl sm:text-3xl">Your Journey Path</h2>

          <p className="mt-2 text-sm text-white/55">
            Every temple you visit lights up one stop on the path.
          </p>

          <div className="relative mt-10">
            <div className="absolute left-[5%] right-[5%] top-5 hidden h-0.5 bg-white/10 sm:block">
              <div
                className="h-full bg-[#c18a43] transition-all duration-1000"
                style={{ width: `${pathFill * 100}%` }}
              />
            </div>

            <div className="relative grid grid-cols-5 gap-y-8 sm:grid-cols-10">
              {Array.from({ length: TOTAL_TEMPLES }, (_, index) => {
                const number = index + 1;
                const reached = number <= visitedCount;
                const milestone = MILESTONES.find(
                  (item) => item.threshold === number
                );

                return (
                  <div
                    key={number}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      title={`Temple ${number}`}
                      className={`flex items-center justify-center rounded-full border-2 font-serif font-bold transition duration-500 ${
                        milestone ? "-mt-1 h-12 w-12 text-lg" : "h-10 w-10 text-sm"
                      } ${
                        reached
                          ? "border-transparent bg-[#c18a43] text-white shadow-lg shadow-[#c18a43]/30"
                          : "border-white/20 bg-[#29251f] text-white/40"
                      }`}
                      style={
                        milestone
                          ? {
                              borderColor: reached ? "transparent" : milestone.color,
                              backgroundColor: reached ? milestone.color : undefined,
                              color: reached ? "#29251f" : milestone.color,
                            }
                          : undefined
                      }
                    >
                      {reached && !milestone ? <Check size={17} /> : number}
                    </div>

                    <p
                      className="mt-2 h-4 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: milestone?.color }}
                    >
                      {milestone?.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16">
          <h2 className="text-center font-serif text-2xl sm:text-3xl">
            How It Works
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c18a43]/50 hover:bg-white/[0.07]"
                >
                  <span className="absolute right-5 top-4 font-serif text-4xl font-bold text-white/[0.07]">
                    {index + 1}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c18a43] transition duration-300 group-hover:scale-110">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 font-serif text-lg">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* MILESTONES */}
        <section className="mt-16">
          <h2 className="text-center font-serif text-2xl sm:text-3xl">
            Your Milestones
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {MILESTONES.map((milestone) => {
              const unlocked = visitedCount >= milestone.threshold;
              const remaining = milestone.threshold - visitedCount;

              return (
                <div
                  key={milestone.key}
                  className={`relative overflow-hidden rounded-2xl border p-6 transition duration-300 ${
                    unlocked ? "" : "opacity-70"
                  }`}
                  style={{
                    borderColor: unlocked ? milestone.color : "rgba(255,255,255,0.1)",
                    backgroundColor: unlocked
                      ? `${milestone.color}1a`
                      : "rgba(255,255,255,0.04)",
                    boxShadow: unlocked ? `0 0 40px ${milestone.color}22` : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-serif text-2xl font-bold"
                      style={{
                        borderColor: milestone.color,
                        backgroundColor: unlocked ? milestone.color : "transparent",
                        color: unlocked ? "#29251f" : milestone.color,
                      }}
                    >
                      {String(milestone.threshold).padStart(2, "0")}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-xl">{milestone.title}</h3>

                      <p className="mt-1 text-sm text-white/50">
                        {milestone.subtitle}
                      </p>
                    </div>

                    {unlocked ? (
                      <Check size={22} style={{ color: milestone.color }} />
                    ) : (
                      <Lock size={20} className="text-white/30" />
                    )}
                  </div>

                  <p
                    className="mt-5 rounded-lg bg-black/20 px-4 py-2.5 text-center text-sm font-medium"
                    style={{ color: unlocked ? milestone.color : "rgba(255,255,255,0.55)" }}
                  >
                    {unlocked
                      ? "Unlocked · certificate ready"
                      : `${remaining} more ${remaining === 1 ? "temple" : "temples"} to go`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CERTIFICATE */}
        <section
          ref={certificateRef}
          className="mt-16 scroll-mt-24 rounded-3xl border border-[#c18a43]/30 bg-white/[0.04] p-6 sm:p-10"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c18a43]">
              <Award size={24} />
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl">
                Get Your Certificate
              </h2>

              <p className="mt-1 text-sm text-white/55">
                Complete 3 temple darshans to unlock your certificate.
              </p>
            </div>
          </div>

          {earnedTier ? (
            <div className="grid items-center gap-10 lg:grid-cols-2">

              <form onSubmit={handleDownload}>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#c18a43]/15 px-4 py-1.5 text-sm font-semibold text-[#e8bd78]">
                  <Check size={15} />
                  You have earned: {earnedTier.title}
                </p>

                <label
                  htmlFor="certificate-name"
                  className="mb-2 block text-sm font-semibold text-white/80"
                >
                  Your Name (as it should appear on the certificate)
                </label>

                <input
                  id="certificate-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-[#c18a43] focus:ring-4 focus:ring-[#c18a43]/15"
                />

                {error && (
                  <p className="mt-3 rounded-lg bg-red-500/15 p-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={generating}
                  className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#c18a43] px-8 font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-[#a96b24] hover:shadow-lg disabled:opacity-60 sm:w-auto"
                >
                  <Download size={18} />
                  {generating ? "Preparing..." : "Download Certificate (PDF)"}
                </button>
              </form>

              {/* Live preview */}
              <div>
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
                  Live Preview
                </p>

                <div
                  className="relative mx-auto aspect-[1.414/1] w-full max-w-md rounded-lg p-3 shadow-2xl"
                  style={{
                    backgroundColor: previewTheme.bg,
                    border: `3px solid ${previewTheme.border}`,
                  }}
                >
                  <div
                    className="flex h-full flex-col items-center justify-center rounded-sm px-4 text-center"
                    style={{ border: `1px solid ${previewTheme.accent}` }}
                  >
                    <p
                      className="text-[9px] font-bold uppercase tracking-[3px] sm:text-[10px]"
                      style={{ color: previewTheme.accent }}
                    >
                      Jain Darshan · Lonavala
                    </p>

                    <p
                      className="mt-2 font-serif text-lg font-bold sm:text-2xl"
                      style={{ color: previewTheme.text }}
                    >
                      {earnedTier.key === "elite"
                        ? "Certificate of Excellence"
                        : "Certificate of Darshan"}
                    </p>

                    <p
                      className="mt-1 text-[9px] font-bold uppercase tracking-[3px]"
                      style={{ color: previewTheme.accent }}
                    >
                      {earnedTier.badge} Achievement
                    </p>

                    <div
                      className="my-3 h-px w-2/3"
                      style={{ backgroundColor: previewTheme.accent }}
                    />

                    <p
                      className="max-w-full truncate font-serif text-xl font-bold italic sm:text-3xl"
                      style={{ color: previewTheme.name }}
                    >
                      {previewName}
                    </p>

                    <div
                      className="mt-3 flex h-10 w-10 items-center justify-center rounded-full border-2 font-serif text-sm font-bold"
                      style={{
                        borderColor: previewTheme.accent,
                        color: previewTheme.name,
                      }}
                    >
                      {earnedTier.threshold}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-xs text-white/40">
                  The downloaded PDF has the full design.
                </p>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl bg-white/[0.06] p-6 text-center">
              <Lock size={28} className="mx-auto text-white/40" />

              <p className="mt-3 text-white/70">
                Visit at least 3 temples to unlock your certificate.
              </p>

              <Link
                to="/temples"
                className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c18a43] px-7 text-sm font-semibold transition hover:bg-[#a96b24]"
              >
                Find Temples to Visit
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Journey;