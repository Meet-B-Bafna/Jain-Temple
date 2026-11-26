import { useState } from "react";
import { ArrowRight, Sparkles, Award, Download, Lock, Check } from "lucide-react";

import { getVisitedTemples } from "../services/darshan";
import { getEarnedTier, downloadCertificate } from "../utils/certificate";

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;

function Journey() {
  const steps = [
    "Visit sacred Jain temples",
    "Scan temple QR codes to record visits",
    "Unlock Darshan achievements",
    "Receive your digital certificates",
  ];

  const milestones = [
    ["03", "Bronze Darshan", "First milestone"],
    ["05", "Silver Darshan", "A growing journey"],
    ["10", "Complete Jain Darshan", "Special achievement"],
  ];

  const [visitedCount] = useState(() => getVisitedTemples().length);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  const earnedTier = getEarnedTier(visitedCount);
  const progressPercent = Math.min(visitedCount, 10) * 10;

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

  return (
    <main className="min-h-screen bg-[#29251f] px-5 py-20 text-white sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-[#e8bd78]">
            Your Spiritual Experience
          </p>

          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            Begin Your Own
            <span className="block italic text-[#e8bd78]">
              Jain Darshan Journey.
            </span>
          </h1>

          <p className="mt-7 max-w-xl leading-8 text-white/65">
            Visit Jain temples across Lonavala, scan their unique QR codes
            and keep track of your spiritual journey.
          </p>

          <div className="mt-9 space-y-5">
            {steps.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c18a43] font-bold">
                  {index + 1}
                </div>
                <p className="text-base text-white/85">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert("Darshan Journey will be available soon!")}
            className="mt-10 flex min-h-14 items-center rounded-full bg-[#c18a43] px-8 text-base font-semibold"
          >
            Start My Journey
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>

        <div className="rounded-3xl border border-[#c18a43]/30 bg-white/[0.04] p-6 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Darshan Achievements</p>
              <h2 className="mt-2 font-serif text-2xl">
                Your Milestones
              </h2>
            </div>

            <Sparkles className="text-[#e8bd78]" size={30} />
          </div>

          {milestones.map(([number, title, subtitle]) => {
            const unlocked = visitedCount >= Number(number);

            return (
              <div
                key={number}
                className={`mb-4 flex items-center gap-5 rounded-2xl border p-5 transition ${
                  unlocked
                    ? "border-[#c18a43]/60 bg-[#c18a43]/10"
                    : "border-white/10 bg-white/[0.04] opacity-70"
                }`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-serif text-xl ${
                    unlocked
                      ? "border-[#c18a43] bg-[#c18a43] text-white"
                      : "border-[#c18a43]/60 text-[#e8bd78]"
                  }`}
                >
                  {number}
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-lg">{title}</h3>
                  <p className="mt-1 text-sm text-white/45">{subtitle}</p>
                </div>

                {unlocked ? (
                  <Check className="text-[#e8bd78]" size={22} />
                ) : (
                  <Lock className="text-white/30" size={20} />
                )}
              </div>
            );
          })}

          <p className="mt-6 text-center text-sm text-white/40">
            Every visit becomes a part of your journey.
          </p>
        </div>

      </div>

      {/* CERTIFICATE */}
      <section className="mx-auto mt-16 max-w-3xl rounded-3xl border border-[#c18a43]/30 bg-white/[0.04] p-6 sm:p-10">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c18a43]">
            <Award size={24} />
          </div>

          <div>
            <h2 className="font-serif text-2xl">Get Your Certificate</h2>
            <p className="mt-1 text-sm text-white/50">
              Complete 3 temple darshans to unlock your certificate.
            </p>
          </div>
        </div>

        <div className="mb-2 flex justify-between text-sm text-white/60">
          <span>Temples visited</span>
          <span>{Math.min(visitedCount, 10)} of 10</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#c18a43] transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {earnedTier ? (
          <form onSubmit={handleDownload} className="mt-8">
            <p className="mb-4 text-sm text-[#e8bd78]">
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
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#c18a43]"
            />

            {error && (
              <p className="mt-3 rounded-lg bg-red-500/15 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={generating}
              className="mt-6 flex min-h-14 items-center gap-2 rounded-full bg-[#c18a43] px-8 font-semibold transition hover:bg-[#a96b24] disabled:opacity-60"
            >
              <Download size={18} />
              {generating ? "Preparing..." : "Download Certificate (PDF)"}
            </button>
          </form>
        ) : (
          <p className="mt-8 flex items-center gap-2 rounded-lg bg-white/[0.06] p-4 text-sm text-white/60">
            <Lock size={16} className="shrink-0" />
            Visit at least 3 temples to unlock your certificate.
          </p>
        )}
      </section>
    </main>
  );
}

export default Journey;