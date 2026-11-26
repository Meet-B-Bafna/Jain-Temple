import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Camera,
  ArrowLeft,
  ExternalLink,
  Landmark,
  Building2,
  Sunrise,
  Sunset,
  Share2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Flower2,
} from "lucide-react";

import { getTempleById } from "../services/api";

/* ---------- Small building blocks ---------- */

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#e9dfcc] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a96b24]/10 text-[#a96b24]">
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#8a7e6a]">
        {label}
      </p>

      <p
        className={`mt-1 whitespace-pre-line font-serif text-lg font-bold leading-snug ${
          value ? "text-[#332719]" : "text-[#b3a791]"
        }`}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}

function Card({ icon, title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#e9dfcc] bg-white p-6 shadow-sm sm:p-8 ${className}`}
    >
      <h2 className="mb-5 flex items-center gap-3 font-serif text-xl font-bold text-[#332719] sm:text-2xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a96b24] text-white">
          {icon}
        </span>
        {title}
      </h2>

      {children}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#8b581f]">{label}</p>

      <p
        className={`mt-1 whitespace-pre-line leading-7 ${
          value ? "text-[#665f54]" : "italic text-[#b3a791]"
        }`}
      >
        {value || "Information unavailable"}
      </p>
    </div>
  );
}

/* ---------- Page ---------- */

function TempleDetails() {
  const { templeId } = useParams();

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [copied, setCopied] = useState(false);

  const photos = Array.isArray(temple?.photos)
    ? temple.photos.filter((photo) => photo?.image_url)
    : [];

  useEffect(() => {
    async function fetchTemple() {
      try {
        setLoading(true);
        setError("");

        const data = await getTempleById(templeId);
        setTemple(data);
      } catch (err) {
        setError("Unable to load temple details.");
      } finally {
        setLoading(false);
      }
    }

    fetchTemple();
  }, [templeId]);

  // Keyboard controls for the photo viewer
  useEffect(() => {
    if (lightbox === null) return;

    function handleKey(event) {
      if (event.key === "Escape") {
        setLightbox(null);
      } else if (event.key === "ArrowRight") {
        setLightbox((index) => (index + 1) % photos.length);
      } else if (event.key === "ArrowLeft") {
        setLightbox((index) => (index - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, photos.length]);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: temple.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      /* Sharing was cancelled or is not available. */
    }
  }

  /* ----- Loading and error states ----- */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f1ecdf]">
        <div className="animate-pulse">
          <div className="h-[420px] bg-[#e2d7c0] sm:h-[520px]" />

          <div className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="h-36 rounded-2xl bg-[#e9dfcc]" />
              <div className="h-36 rounded-2xl bg-[#e9dfcc]" />
              <div className="h-36 rounded-2xl bg-[#e9dfcc]" />
              <div className="h-36 rounded-2xl bg-[#e9dfcc]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !temple) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f1ecdf] px-4 text-center">
        <Flower2 size={44} className="text-[#a96b24]" />

        <h2 className="mt-4 font-serif text-3xl text-[#332719]">
          Temple Not Found
        </h2>

        <p className="mt-3 text-[#665f54]">
          We couldn't find the requested temple.
        </p>

        <Link
          to="/temples"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a96b24] px-7 py-3 text-sm font-semibold text-white hover:bg-[#89551c]"
        >
          <ArrowLeft size={17} />
          Back to Temples
        </Link>
      </main>
    );
  }

  /* ----- Derived values ----- */

  const seva = Array.isArray(temple.seva_options)
    ? temple.seva_options.filter((item) => item?.name)
    : [];

  const donation = temple.donation_details || {};
  const hasDonation = Boolean(
    donation.beneficiary_name ||
      donation.payment_details ||
      donation.instructions
  );

  const hasStory = Boolean(
    temple.history || temple.establishment_details || temple.pratishtha_details
  );

  return (
    <main className="min-h-screen bg-[#f1ecdf]">

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden bg-[#332719] sm:h-[520px]">
        {temple.image_url ? (
          <img
            src={temple.image_url}
            alt={temple.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#5b4934] to-[#332719] text-[#c9b48c]">
            <Camera size={52} />
            <p>Temple photograph coming soon</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#211d18] via-[#211d18]/40 to-black/30" />

        <div className="absolute inset-x-0 top-0 mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
          <Link
            to="/temples"
            className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/55"
          >
            <ArrowLeft size={17} />
            All Temples
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/55"
          >
            {copied ? <Check size={17} /> : <Share2 size={17} />}
            {copied ? "Link copied" : "Share"}
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c98d]/50 bg-black/25 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f4dfb8]">
            <Sparkles size={13} />
            Sacred Destination · Lonavala
          </p>

          <h1 className="max-w-4xl font-serif text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {temple.name}
          </h1>

          <p className="mt-4 flex max-w-2xl items-start gap-2 text-white/80">
            <MapPin size={19} className="mt-0.5 shrink-0 text-[#e8c98d]" />
            {temple.address || "Address information unavailable"}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* QUICK INFO */}
        <section className="relative z-10 -mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<Sunrise size={21} />}
            label="Morning Darshan"
            value={temple.morning_timings}
          />

          <InfoCard
            icon={<Sunset size={21} />}
            label="Evening Darshan"
            value={temple.evening_timings}
          />

          <InfoCard
            icon={<Landmark size={21} />}
            label="Moolnayak / Bhagwan"
            value={temple.main_deity}
          />

          <InfoCard
            icon={<BookOpen size={21} />}
            label="Tradition"
            value={temple.tradition}
          />
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* MAIN COLUMN */}
          <div className="space-y-8 lg:col-span-2">

            <Card icon={<BookOpen size={20} />} title="About the Temple">
              {hasStory ? (
                <div className="space-y-6">
                  {temple.history && (
                    <Detail label="History" value={temple.history} />
                  )}

                  {temple.establishment_details && (
                    <Detail
                      label="Establishment"
                      value={temple.establishment_details}
                    />
                  )}

                  {temple.pratishtha_details && (
                    <Detail
                      label="Pratishtha"
                      value={temple.pratishtha_details}
                    />
                  )}
                </div>
              ) : (
                <p className="italic text-[#b3a791]">
                  The history of this temple will be added soon.
                </p>
              )}
            </Card>

            {photos.length > 0 && (
              <Card icon={<Camera size={20} />} title="Photo Gallery">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((photo, index) => (
                    <button
                      key={`${photo.image_url}-${index}`}
                      type="button"
                      onClick={() => setLightbox(index)}
                      aria-label={`Open photo ${index + 1}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e9dfcc]"
                    >
                      <img
                        src={photo.image_url}
                        alt={photo.caption || `${temple.name} photo ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {seva.length > 0 && (
              <Card icon={<HeartHandshake size={20} />} title="Seva Options">
                <div className="grid gap-4 sm:grid-cols-2">
                  {seva.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="rounded-xl border border-[#e9dfcc] bg-[#faf8f2] p-5"
                    >
                      <h3 className="font-serif text-lg font-bold text-[#332719]">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-sm leading-6 text-[#665f54]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">

            <Card icon={<MapPin size={20} />} title="Plan Your Visit">
              <div className="space-y-5">
                <Detail label="Address" value={temple.address} />

                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#8b581f]">
                    <Phone size={15} />
                    Temple Contact
                  </p>

                  <p
                    className={`mt-1 whitespace-pre-line leading-7 ${
                      temple.contact ? "text-[#665f54]" : "italic text-[#b3a791]"
                    }`}
                  >
                    {temple.contact || "Information unavailable"}
                  </p>
                </div>

                {temple.maps_url && (
                  <a
                    href={temple.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#a96b24] px-5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#82501b] hover:shadow-lg"
                  >
                    <MapPin size={18} />
                    Navigate to Temple
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </Card>

            <Card icon={<Building2 size={20} />} title="Facilities">
              <Detail label="Available Facilities" value={temple.facilities} />
            </Card>

            {hasDonation && (
              <Card icon={<HeartHandshake size={20} />} title="Donation">
                <div className="space-y-4">
                  {donation.beneficiary_name && (
                    <Detail label="Beneficiary" value={donation.beneficiary_name} />
                  )}

                  {donation.payment_details && (
                    <Detail label="Payment Details" value={donation.payment_details} />
                  )}

                  {donation.instructions && (
                    <Detail label="Instructions" value={donation.instructions} />
                  )}
                </div>
              </Card>
            )}

            <div className="flex gap-4 rounded-2xl border border-[#e9dfcc] bg-[#f8f4eb] p-5">
              <ShieldCheck size={24} className="mt-0.5 shrink-0 text-[#a96b24]" />

              <div>
                <h3 className="font-serif text-lg font-bold text-[#332719]">
                  Information Status
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#665f54]">
                  {temple.verification_status ||
                    "Verification status unavailable"}
                </p>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* PHOTO VIEWER */}
      {lightbox !== null && photos[lightbox] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightbox((lightbox - 1 + photos.length) % photos.length);
                }}
                aria-label="Previous photo"
                className="absolute left-3 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25 sm:left-6"
              >
                <ChevronLeft size={26} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightbox((lightbox + 1) % photos.length);
                }}
                aria-label="Next photo"
                className="absolute right-3 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25 sm:right-6"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <figure
            className="max-h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={photos[lightbox].image_url}
              alt={photos[lightbox].caption || temple.name}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />

            <figcaption className="mt-3 text-center text-sm text-white/80">
              {photos[lightbox].caption && (
                <span>{photos[lightbox].caption} · </span>
              )}
              {lightbox + 1} / {photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

export default TempleDetails;