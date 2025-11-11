import React, { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ContactExperience from "../components/contact/ContactExperience.jsx";

/*
  Contact form posts to your backend server (server/index.js).
  - Server URL taken from VITE_APP_SERVER_URL or falls back to http://localhost:5000
  - Uses fetch (no new dependency)
  - Responsive layout uses react-responsive hooks
*/

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl.replace(/\/$/, "")}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");

      alert("Thank you — your message was sent.");
      setForm({ name: "", email: "", message: "" });
      if (formRef.current) formRef.current.reset();
    } catch (err) {
      console.error("Send error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="c-space my-14">
      <div className="flex flex-col items-center gap-4">
        <div className="hero-badge text-white mx-auto font-retrofamous my-2 text-4xl">
          Contact Information
        </div>
        <h2 className="head-text font-virgo text-center">Get in Touch — Let’s Connect</h2>
      </div>

      <div className={`mt-16 grid gap-12 ${isMobile ? "grid-cols-1" : "lg:grid-cols-2"}`}>
        {/* Left: Form card */}
        <div className="grid-container-modified p-8 rounded-3xl bg-[#0b0b0d] shadow-xl">
          <form ref={formRef} onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-300 mb-2">Your name</label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="What's your good name?"
                  className="field-input mt-1 pl-12"
                  type="text"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-300 mb-2">Your Email</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="What's your email address?"
                  className="field-input mt-1 pl-12"
                  type="email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-gray-300 mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can I help you?"
                rows={6}
                className="field-input mt-1 resize-none"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg ${
                  isMobile ? "text-sm" : "text-base"
                } bg-gradient-to-r from-white/90 to-white/70 text-black font-medium shadow-md hover:opacity-95 transition`}
              >
                {loading ? (
                  <>
                    <img src="/assets/spinner.svg" alt="loading" className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <img src="/assets/send.png" alt="send" className="w-5 h-5" />
                    SEND MESSAGE
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: 3D / Illustration card */}
        <div className={`${isMobile ? "" : "lg:min-h-[500px]"} rounded-3xl overflow-hidden`}>
          <div
            className={`w-full h-full rounded-3xl overflow-hidden`}
            style={{
              background: isMobile ? "#d98b3d" : "#cd7c2e",
              minHeight: isMobile ? 320 : 520,
            }}
          >
            <ContactExperience />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;