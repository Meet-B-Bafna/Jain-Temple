import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight, Camera } from "lucide-react";

function TempleSection({ temples }) {
  return (
    <section
      id="temples"
      className="bg-[#f1ecdf] px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#a96b24]">
              Sacred Destinations
            </p>

            <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Explore Jain Temples
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#665f54] sm:text-lg">
              Discover sacred Jain temples of Lonavala, their history,
              timings and important visitor information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {temples.map((temple, index) => (
            <article
              key={temple.temple_id}
              className="group overflow-hidden rounded-2xl border border-[#e9dfcc] bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <TempleImage temple={temple} />

              <div className="p-5 sm:p-6">
                <p className="mb-3 flex items-start gap-2 text-sm leading-6 text-[#8b581f]">
                  <MapPin size={18} className="mt-1 shrink-0" />
                  {temple.address || "Lonavala, Maharashtra"}
                </p>

                <h3 className="font-serif text-xl font-bold leading-snug sm:text-2xl">
                  {temple.name}
                </h3>

                <p className="mt-3 text-base text-[#665f54]">
                  Moolnayak: {temple.main_deity || "Information coming soon"}
                </p>

                <div className="mt-6 flex flex-col gap-3 border-t border-[#eee7db] pt-4">
                  {temple.maps_url && (
                    <a
                      href={temple.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#a96b24] px-4 text-sm font-bold text-white transition hover:bg-[#82501b]"
                    >
                      <MapPin size={17} />
                      View on Google Maps
                    </a>
                  )}
                  <Link
                  to={`/temples/${temple.temple_id}`}
                  className="flex min-h-12 items-center justify-between rounded-lg text-base font-bold text-[#a96b24] hover:text-[#82501b]"
                  >
                    Temple Details
                    <ChevronRight size={22} />
                    </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm leading-6 text-[#665f54]">
          Some temple photographs and details are awaiting verification.
        </p>
      </div>
    </section>
  );
}

function TempleImage({ temple }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#e9dfcc]">
      {!loaded && !failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#a18b6b]">
          <Camera size={42} strokeWidth={1.3} />
          <span className="text-sm font-medium">Loading photograph...</span>
        </div>
      )}

      {temple.image_url && !failed && (
        <img
          src={temple.image_url}
          alt={temple.name}
          loading={temple.temple_id === "01" ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={temple.temple_id === "01" ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {(!temple.image_url || failed) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#a18b6b]">
          <Camera size={42} strokeWidth={1.3} />
          <span className="text-sm font-medium">
            Temple photograph coming soon
          </span>
        </div>
      )}

      <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8b581f] shadow-sm">
        {temple.temple_id === "01" ? "Featured Temple" : "Discover"}
      </span>
    </div>
  );
}

export default TempleSection;