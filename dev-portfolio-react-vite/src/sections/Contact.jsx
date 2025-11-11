import { useRef, useState } from "react";
// import emailjs from "@emailjs/browser";

import ContactExperience from "../components/contact/ContactExperience.jsx";

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Sohom",
          from_email: form.email,
          to_email: "sohom.official21@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      alert("Thank you. I will get back to you as soon as possible.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Ahh, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="c-space my-14">
      <div className="flex flex-col items-center gap-4">
        <div className="hero-badge">
          <img
            src="/assets/chat.svg"
            alt="chat icon"
            className="w-5 h-5 inline-block mr-2 invert brightness-0"
          />
          Contact Information
        </div>
        <h2 className="head-text">Get In Touch With Me</h2>
      </div>

      <div className="mt-16 grid lg:grid-cols-2 gap-12">
        {/* Left Side: Form */}
        <div className="grid-container-modified p-8">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-8"
          >
            <div>
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="field-input mt-2"
              />
            </div>

            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
                className="field-input mt-2"
              />
            </div>

            <div>
              <label htmlFor="message" className="field-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message"
                rows="5"
                required
                className="field-input mt-2 resize-none"
              />
            </div>

            <button
              type="submit"
              className="field-btn bg-black-500 hover:bg-black-600"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
              <img
                src="/assets/send.svg"
                alt="send icon"
                className="field-btn_arrow"
              />
            </button>
          </form>
        </div>

        {/* Right Side: 3D Model */}
        <div className="lg:min-h-[500px] min-h-96">
          <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
            <ContactExperience />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;