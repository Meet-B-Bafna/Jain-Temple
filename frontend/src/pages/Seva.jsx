import { Heart, HandHeart, PawPrint } from "lucide-react";

function Seva() {
  const services = [
    {
      icon: PawPrint,
      title: "Jivdaya Seva",
      description: "Support the care and protection of animals and living beings.",
    },
    {
      icon: Heart,
      title: "Temple Seva",
      description: "Contribute towards temple maintenance and religious activities.",
    },
    {
      icon: HandHeart,
      title: "Sadharmik Seva",
      description: "Support and help fellow members of the Jain community.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf8f2] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-bold uppercase tracking-widest text-[#a96b24]">
            Give With Devotion
          </p>

          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
            Seva & Donations
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#665f54]">
            Explore different ways to contribute towards Jain temples,
            community welfare and acts of kindness.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="rounded-2xl border border-[#e9dfcc] bg-white p-7"
              >
                <Icon size={38} className="text-[#a96b24]" />

                <h2 className="mt-5 font-serif text-2xl font-bold">
                  {service.title}
                </h2>

                <p className="mt-3 leading-7 text-[#665f54]">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-10 rounded-xl bg-[#f1ecdf] p-5 text-center text-sm leading-7 text-[#665f54]">
          Official seva and donation details will be displayed only after
          confirmation from the respective temple trusts.
        </p>
      </div>
    </main>
  );
}

export default Seva;