import { useState } from "react";
import { Compass, Heart, Flower2, Phone, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";

const CREATOR_NAME = "Meet Bafna";
const CONTACT_PHONE = "9309271595";
const CONTACT_EMAIL = "meetbafna28@gmail.com";

function About() {
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackType, setFeedbackType] = useState("Suggestion");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  function handleFeedbackSubmit(event) {
    event.preventDefault();

    const subject = `Jain Darshan - ${feedbackType}`;
    const body = `Name: ${feedbackName || "Not provided"}\nType: ${feedbackType}\n\n${feedbackMessage}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  const inputClass =
    "w-full rounded-lg border border-[#e9dfcc] bg-white px-4 py-3 text-sm outline-none focus:border-[#a96b24]";

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

        {/* MADE BY */}
        <section className="mt-20 rounded-2xl border border-[#e9dfcc] bg-white p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a96b24]">
            Created By
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold text-[#332719]">
            {CREATOR_NAME}
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#665f54]">
            This platform was designed and developed to bring the Jain
            temples of Lonavala closer to devotees.
          </p>
        </section>

        {/* CONTACT */}
        <section className="mt-10">
          <h2 className="font-serif text-3xl font-bold text-[#332719]">
            Contact Us
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <a
              href={`tel:+91${CONTACT_PHONE}`}
              className="group rounded-2xl border border-[#e9dfcc] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Phone className="mx-auto text-[#a96b24]" size={32} />
              <p className="mt-4 text-sm text-[#777064]">Call</p>
              <p className="mt-1 text-lg font-semibold text-[#332719]">
                +91 {CONTACT_PHONE}
              </p>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group rounded-2xl border border-[#e9dfcc] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Mail className="mx-auto text-[#a96b24]" size={32} />
              <p className="mt-4 text-sm text-[#777064]">Email</p>
              <p className="mt-1 break-all text-lg font-semibold text-[#332719]">
                {CONTACT_EMAIL}
              </p>
            </a>
          </div>
        </section>

        {/* SUGGESTIONS / PROBLEMS */}
        <section className="mt-10 rounded-2xl border border-[#e9dfcc] bg-white p-8 text-left sm:p-10">
          <h2 className="text-center font-serif text-3xl font-bold text-[#332719]">
            Suggestions & Problems
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-center leading-7 text-[#665f54]">
            Found something wrong, or have an idea to improve the website?
            Let us know.
          </p>

          <form onSubmit={handleFeedbackSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="feedback-name"
                  className="mb-2 block text-sm font-semibold text-[#5b4934]"
                >
                  Your Name
                </label>

                <input
                  id="feedback-name"
                  type="text"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-type"
                  className="mb-2 block text-sm font-semibold text-[#5b4934]"
                >
                  Type
                </label>

                <select
                  id="feedback-type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className={inputClass}
                >
                  <option>Suggestion</option>
                  <option>Problem</option>
                  <option>Wrong Temple Information</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="mb-2 block text-sm font-semibold text-[#5b4934]"
              >
                Message
              </label>

              <textarea
                id="feedback-message"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
                rows={5}
                placeholder="Write your suggestion or describe the problem"
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex min-h-12 items-center gap-2 rounded-full bg-[#a96b24] px-7 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#89551c] hover:shadow-lg"
              >
                <Send size={17} />
                Send Message
              </button>
            </div>

            <p className="text-center text-xs text-[#777064]">
              This opens your email app with the message ready to send.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default About;