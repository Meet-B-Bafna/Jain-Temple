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
  Info,
} from "lucide-react";

import { getTempleById } from "../services/api";

function TempleDetails() {
  const { templeId } = useParams();

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f1ecdf] py-20 text-center">
        Loading temple details...
      </main>
    );
  }

  if (error || !temple) {
    return (
      <main className="min-h-screen bg-[#f1ecdf] px-4 py-20 text-center">
        <h2 className="font-serif text-3xl">Temple Not Found</h2>
        <p className="mt-3 text-[#665f54]">
          We couldn't find the requested temple.
        </p>
        <Link
          to="/temples"
          className="mt-6 inline-block font-bold text-[#a96b24]"
        >
          Back to Temples
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1ecdf]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <Link
          to="/temples"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-[#a96b24]"
        >
          <ArrowLeft size={18} />
          Back to Temples
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="relative h-72 bg-[#e9dfcc] sm:h-96 lg:h-[480px]">
            {temple.image_url ? (
              <img
                src={temple.image_url}
                alt={temple.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[#a18b6b]">
                <Camera size={52} />
                <p>Temple photograph coming soon</p>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#a96b24]">
              Sacred Destination · Lonavala
            </p>

            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {temple.name}
            </h1>

            <p className="mt-4 flex items-start gap-2 text-[#665f54]">
              <MapPin size={19} className="mt-1 shrink-0" />
              {temple.address || "Address information unavailable"}
            </p>

            {temple.maps_url && (
              <a
                href={temple.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#a96b24] px-5 py-3 font-bold text-white hover:bg-[#82501b]"
              >
                <MapPin size={18} />
                Navigate to Temple
                <ExternalLink size={16} />
              </a>
            )}

            <div className="my-10 border-t border-[#eee7db]" />

            <div className="grid gap-8 md:grid-cols-2">

              <DetailSection
                icon={<Landmark size={22} />}
                title="Temple Information"
              >
                <Detail label="Tradition" value={temple.tradition} />
                <Detail label="Moolnayak / Bhagwan" value={temple.main_deity} />
                <Detail label="History" value={temple.history} />
              </DetailSection>

              <DetailSection
                icon={<Clock size={22} />}
                title="Darshan Timings"
              >
                <Detail label="Morning" value={temple.morning_timings} />
                <Detail label="Evening" value={temple.evening_timings} />
              </DetailSection>

              <DetailSection
                icon={<Phone size={22} />}
                title="Contact Information"
              >
                <Detail label="Temple Contact" value={temple.contact} />
              </DetailSection>

              <DetailSection
                icon={<Info size={22} />}
                title="Facilities"
              >
                <Detail label="Available Facilities" value={temple.facilities} />
              </DetailSection>

            </div>

            <div className="mt-10 rounded-xl bg-[#f8f4eb] p-5">
              <h3 className="font-serif text-lg font-bold">
                Information Status
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#665f54]">
                {temple.verification_status || "Verification status unavailable"}
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

function DetailSection({ icon, title, children }) {
  return (
    <section>
      <h2 className="mb-5 flex items-center gap-3 font-serif text-xl font-bold text-[#8b581f]">
        {icon}
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#8b581f]">{label}</p>
      <p className="mt-1 whitespace-pre-line leading-7 text-[#665f54]">
        {value || "Information unavailable"}
      </p>
    </div>
  );
}

export default TempleDetails;