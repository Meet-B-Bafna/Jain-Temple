import {
  MapPin,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Flower2,
} from "lucide-react";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative flex min-h-[680px] items-center overflow-hidden bg-[#211d18] sm:min-h-[750px] lg:min-h-[850px]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/5/57/Guj21_Girnar_Ropeway_view_Jain_temples_Bhavnath.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#211d18]/90" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-28 text-center sm:px-8 lg:px-12">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8c98d]/50 bg-black/25 px-4 py-2">
            <Sparkles size={15} className="text-[#e8c98d]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#f4dfb8]">
              A Journey of Faith & Devotion
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl font-serif text-4xl leading-tight text-white sm:text-6xl lg:text-7xl">
            Discover the Sacred
            <span className="mt-2 block italic text-[#e8c98d]">
              Jain Heritage
            </span>
            of Lonavala
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/80 sm:text-lg">
            Explore the beautiful Jain temples of Lonavala, discover their
            stories, experience divine darshan, and begin your journey
            through faith and devotion.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <a
              href="/temples"
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#c18a43] px-8 text-sm font-semibold text-white sm:w-auto"
            >
              Explore Temples <ArrowRight size={17} />
            </a>

            <a
              href="/journey"
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white/60 bg-white/10 px-8 text-sm font-semibold text-white sm:w-auto"
            >
              Begin Your Darshan Journey
              <ChevronRight size={17} />
            </a>

          </div>

          <div className="mt-14 flex items-center justify-center gap-2 text-sm text-white/70">
            <MapPin size={16} className="text-[#e8c98d]" />
            Lonavala, Maharashtra, India
          </div>
        </div>

        <div className="absolute bottom-0 h-20 w-full bg-gradient-to-t from-[#faf8f2] to-transparent" />
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-[#a96b24]">
              Welcome to Jain Darshan
            </p>

            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
              Every Temple Has
              <span className="block italic text-[#a96b24]">
                A Story to Tell.
              </span>
            </h2>

            <p className="mt-7 leading-8 text-[#777064]">
              Lonavala is home to sacred Jain places that carry generations
              of faith, devotion and heritage. This platform brings their
              stories together in one place.
            </p>

            <p className="mt-4 leading-8 text-[#777064]">
              Find temple information, plan your visits, discover available
              facilities and experience a meaningful spiritual journey.
            </p>

            <a
              href="/about"
              className="mt-8 inline-flex min-h-12 items-center gap-2 font-semibold text-[#a96b24]"
            >
              Discover Our Purpose <ArrowRight size={18} />
            </a>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85"
              alt="Historic Indian architecture"
              className="h-[350px] w-full rounded-tl-[80px] rounded-br-[80px] object-cover shadow-xl sm:h-[420px]"
            />

            <div className="absolute -bottom-7 left-3 rounded-2xl border border-[#e9dfcc] bg-white p-5 shadow-lg sm:-left-8 sm:p-6">
              <Flower2 className="mb-2 text-[#a96b24]" size={30} />
              <p className="font-serif text-xl font-bold">Faith & Heritage</p>
              <p className="mt-1 text-xs text-[#777064]">
                A journey of devotion
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Home;