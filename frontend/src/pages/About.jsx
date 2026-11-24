import { Compass, Heart, Flower2 } from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="min-h-screen bg-[#faf8f2] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-bold uppercase tracking-widest text-[#a96b24]">
          About Our Initiative
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
          Preserving Faith. Connecting Devotees.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#665f54]">
          Lonavala Jain Darshan is a digital initiative to help devotees
          discover Jain temples, learn their history and plan their
          spiritual journeys across Lonavala.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Explore",
              text: "Discover Jain temples and their important information.",
            },
            {
              icon: Heart,
              title: "Experience",
              text: "Make your Jain Darshan journey meaningful.",
            },
            {
              icon: Flower2,
              title: "Discover",
              text: "Learn about Jain heritage and traditions.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e9dfcc] bg-white p-7"
              >
                <Icon className="mx-auto text-[#a96b24]" size={36} />
                <h2 className="mt-5 font-serif text-2xl font-bold">
                  {item.title}
                </h2>
                <p className="mt-3 leading-7 text-[#665f54]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <Link
          to="/temples"
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-[#a96b24] px-7 py-3 font-bold text-white"
        >
          Explore Temples
        </Link>
      </div>
    </main>
  );
}

export default About;