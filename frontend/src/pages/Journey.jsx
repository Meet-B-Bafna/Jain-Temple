import { ArrowRight, Sparkles } from "lucide-react";

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

          {milestones.map(([number, title, subtitle]) => (
            <div
              key={number}
              className="mb-4 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#c18a43]/60 font-serif text-xl text-[#e8bd78]">
                {number}
              </div>

              <div>
                <h3 className="font-serif text-lg">{title}</h3>
                <p className="mt-1 text-sm text-white/45">{subtitle}</p>
              </div>
            </div>
          ))}

          <p className="mt-6 text-center text-sm text-white/40">
            Every visit becomes a part of your journey.
          </p>
        </div>

      </div>
    </main>
  );
}

export default Journey;