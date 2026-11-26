import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  ArrowUp,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Flower2,
  Landmark,
  Compass,
  HeartHandshake,
} from "lucide-react";

/* ---------- Reveal on scroll ---------- */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Explorer tabs content ---------- */

const EXPLORE_TABS = [
  {
    id: "temples",
    label: "Temples",
    icon: Landmark,
    title: "Explore the Temples",
    text: "Browse the Jain temples of Lonavala, read their history and see darshan timings, facilities and contact details before you visit.",
    cta: "View All Temples",
    to: "/temples",
  },
  {
    id: "journey",
    label: "Journey",
    icon: Compass,
    title: "Plan Your Darshan Journey",
    text: "Follow a guided path through the temples so you can plan your visit and make the most of your time in Lonavala.",
    cta: "Begin Your Journey",
    to: "/journey",
  },
  {
    id: "seva",
    label: "Seva",
    icon: HeartHandshake,
    title: "Take Part in Seva",
    text: "Learn about the seva and donation options offered by each temple and see how you can contribute to its upkeep and activities.",
    cta: "Discover Seva",
    to: "/seva",
  },
];

/* ---------- Page ---------- */

const MUSIC_START_SECONDS = 30;

function Home() {
  const introRef = useRef(null);
  const audioRef = useRef(null);
  const musicButtonRef = useRef(null);
  const userStoppedRef = useRef(false);

  const [musicPlaying, setMusicPlaying] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("temples");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = null;

    function handleScroll() {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        setScrollY(reduceMotion ? 0 : window.scrollY);
        frame = null;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    function seekToStart() {
      if (audio.currentTime < MUSIC_START_SECONDS) {
        audio.currentTime = MUSIC_START_SECONDS;
      }
    }

    const interactionEvents = ["pointerdown", "keydown", "touchstart"];

    function removeInteractionListeners() {
      interactionEvents.forEach((name) =>
        window.removeEventListener(name, handleFirstInteraction)
      );
    }

    function tryPlay() {
      if (userStoppedRef.current || !audio.paused) return;

      seekToStart();

      audio
        .play()
        .then(removeInteractionListeners)
        .catch(() => {
          /* Blocked by the browser: wait for the first tap or key press. */
        });
    }

    function handleFirstInteraction(event) {
      // The mute button has its own click handler.
      if (musicButtonRef.current?.contains(event.target)) return;
      tryPlay();
    }

    audio.addEventListener("loadedmetadata", seekToStart);
    if (audio.readyState >= 1) seekToStart();

    interactionEvents.forEach((name) =>
      window.addEventListener(name, handleFirstInteraction, { passive: true })
    );

    // Try to start immediately when the page opens.
    tryPlay();

    return () => {
      audio.removeEventListener("loadedmetadata", seekToStart);
      removeInteractionListeners();
      audio.pause();
    };
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userStoppedRef.current = false;

      if (audio.currentTime < MUSIC_START_SECONDS) {
        audio.currentTime = MUSIC_START_SECONDS;
      }

      try {
        await audio.play();
      } catch {
        setMusicPlaying(false);
      }
    } else {
      userStoppedRef.current = true;
      audio.pause();
    }
  }

  function handleMusicEnded() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = MUSIC_START_SECONDS;
    audio.play().catch(() => setMusicPlaying(false));
  }

  function scrollToIntro() {
    introRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const parallaxOffset = Math.min(scrollY, 900) * 0.3;
  const currentTab = EXPLORE_TABS.find((tab) => tab.id === activeTab);

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative flex min-h-[680px] items-center overflow-hidden bg-[#211d18] sm:min-h-[750px] lg:min-h-[850px]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/5/57/Guj21_Girnar_Ropeway_view_Jain_temples_Bhavnath.jpg')",
            transform: `translateY(${parallaxOffset}px) scale(1.1)`,
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

            <Link
              to="/temples"
              className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#c18a43] px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#a96b24] hover:shadow-lg hover:shadow-black/30 sm:w-auto"
            >
              Explore Temples
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/journey"
              className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white/60 bg-white/10 px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
            >
              Begin Your Darshan Journey
              <ChevronRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          <div className="mt-14 flex items-center justify-center gap-2 text-sm text-white/70">
            <MapPin size={16} className="text-[#e8c98d]" />
            Lonavala, Maharashtra, India
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToIntro}
          aria-label="Scroll to introduction"
          className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/40 bg-black/20 p-2 text-white/80 transition hover:bg-white/20 hover:text-white motion-safe:animate-bounce"
        >
          <ChevronDown size={22} />
        </button>

        <div className="absolute bottom-0 h-20 w-full bg-gradient-to-t from-[#faf8f2] to-transparent" />
      </section>

      {/* INTRODUCTION */}
      <section
        ref={introRef}
        className="mx-auto max-w-7xl scroll-mt-4 px-5 py-20 sm:px-6 sm:py-24"
      >
        <div className="grid items-center gap-14 md:grid-cols-2">

          <Reveal>
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

            <Link
              to="/about"
              className="group mt-8 inline-flex min-h-12 items-center gap-2 font-semibold text-[#a96b24]"
            >
              Discover Our Purpose
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal delay={150} className="relative">
            <div className="group overflow-hidden rounded-tl-[80px] rounded-br-[80px] shadow-xl">
              <img
                src="/palitana.jpg"
                alt="Jain temples of Palitana on Shatrunjaya hill"
                className="h-[350px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px]"
              />
            </div>

            <div className="absolute -bottom-7 left-3 rounded-2xl border border-[#e9dfcc] bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:-left-8 sm:p-6">
              <Flower2 className="mb-2 text-[#a96b24]" size={30} />
              <p className="font-serif text-xl font-bold">Faith & Heritage</p>
              <p className="mt-1 text-xs text-[#777064]">
                A journey of devotion
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* WHAT WOULD YOU LIKE TO DO */}
      <section className="bg-[#f5f0e6] px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">

          <Reveal className="text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[4px] text-[#a96b24]">
              Start Here
            </p>

            <h2 className="font-serif text-3xl leading-tight text-[#332719] sm:text-4xl">
              What would you like to do?
            </h2>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <div
              role="tablist"
              aria-label="Explore Jain Darshan"
              className="mx-auto flex max-w-xl rounded-full border border-[#e9dfcc] bg-white p-1.5 shadow-sm"
            >
              {EXPLORE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition duration-300 ${
                      isActive
                        ? "bg-[#a96b24] text-white shadow"
                        : "text-[#5b4934] hover:bg-[#f5f0e6]"
                    }`}
                  >
                    <Icon size={17} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              key={currentTab.id}
              role="tabpanel"
              id={`panel-${currentTab.id}`}
              aria-labelledby={`tab-${currentTab.id}`}
              className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#e9dfcc] bg-[#faf8f2] p-8 text-center shadow-sm sm:p-10"
            >
              <h3 className="font-serif text-2xl font-bold text-[#332719]">
                {currentTab.title}
              </h3>

              <p className="mx-auto mt-4 max-w-xl leading-8 text-[#777064]">
                {currentTab.text}
              </p>

              <Link
                to={currentTab.to}
                className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#a96b24] px-7 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#89551c] hover:shadow-lg"
              >
                {currentTab.cta}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* BACKGROUND MUSIC */}
      <audio
        ref={audioRef}
        src="/jain-song.mp3"
        preload="metadata"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onEnded={handleMusicEnded}
      />

      <button
        ref={musicButtonRef}
        type="button"
        onClick={toggleMusic}
        aria-pressed={!musicPlaying}
        aria-label={musicPlaying ? "Mute music" : "Unmute music"}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-[#a96b24] px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-[#89551c]"
      >
        {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        {musicPlaying ? "Mute" : "Unmute"}
      </button>

      {/* BACK TO TOP */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 rounded-full bg-[#a96b24] p-3 text-white shadow-lg transition duration-300 hover:bg-[#89551c] ${
          scrollY > 600
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}

export default Home;