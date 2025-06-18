import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import { Smile, AlertTriangle, Info, XCircle } from "lucide-react";


import {
  Palette,
  Zap,
  Globe,
  Smartphone,
  Code,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Drag & Drop Builder",
      description:
        "Create stunning websites with our intuitive drag and drop interface. No coding required.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Built with modern technology for blazing fast performance and smooth user experience.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Responsive",
      description:
        "All websites are automatically optimized for mobile, tablet, and desktop devices.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "One-Click Publish",
      description:
        "Deploy your website instantly with our integrated hosting and publishing platform.",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Custom Code",
      description:
        "Advanced users can add custom HTML, CSS, and JavaScript for unlimited possibilities.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description:
        "Work together with your team in real-time to create amazing websites.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content:
        "WebCraft made it incredibly easy to create a professional website for my bakery. The drag-and-drop interface is so intuitive!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      content:
        "As a designer, I love how WebCraft gives me the creative freedom I need while being fast and efficient. Perfect for client projects.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      content:
        "Our team can now create landing pages in minutes instead of weeks. WebCraft has revolutionized our workflow.",
      rating: 5,
    },
  ];

  return (
    <div
      className={` ${
        theme === "dark"
          ? "bg-dark-background text-dark-text"
          : "bg-light-background text-light-text"
      }`}
    >
      {/* <Header transparent /> */}

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-6xl font-bold mb-6 ${
                theme === "dark" ? "text-dark-text" : "text-light-text"
              }`}
            >
              Build Stunning Websites
              <span
                className={`block ${
                  theme === "dark" ? "text-dark-primary" : "text-light-primary"
                }`}
              >
                Without Code
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
                theme === "dark" ? "text-dark-infoText" : "text-light-info"
              }`}
            >
              Create professional websites with our powerful drag-and-drop
              builder. Perfect for businesses, portfolios, and creative
              projects.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/dashboard"
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-dark-primary text-white hover:bg-opacity-90"
                    : "bg-light-primary text-white hover:bg-opacity-90"
                }`}
              >
                Start Building Free
                <ArrowRight className="h-5 w-5" />
              </Link>

              <button
                className={`px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-dark-border text-dark-text hover:bg-dark-sidebar"
                    : "border-light-border text-light-text hover:bg-light-sidebar"
                }`}
              >
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 animate-bounce-gentle ${
              theme === "dark" ? "bg-dark-primary" : "bg-light-primary"
            }`}
          ></div>
          <div
            className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-20 animate-bounce-gentle ${
              theme === "dark" ? "bg-dark-accent" : "bg-light-accent"
            }`}
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-dark-sidebar" : "bg-light-sidebar"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-dark-text" : "text-light-text"
              }`}
            >
              Everything You Need to Build Amazing Websites
            </h2>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-dark-infoText" : "text-light-info"
              }`}
            >
              Powerful features that make website building simple and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
                  theme === "dark"
                    ? "bg-dark-background border border-dark-border hover:border-dark-primary"
                    : "bg-light-background border border-light-border hover:border-light-primary"
                }`}
              >
                <div
                  className={`mb-4 ${
                    theme === "dark"
                      ? "text-dark-primary"
                      : "text-light-primary"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-dark-text" : "text-light-text"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-dark-infoText" : "text-light-info"
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-dark-text" : "text-light-text"
              }`}
            >
              Loved by Creators Worldwide
            </h2>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-dark-infoText" : "text-light-info"
              }`}
            >
              See what our users have to say about WebCraft
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${
                  theme === "dark"
                    ? "bg-dark-sidebar border border-dark-border"
                    : "bg-light-sidebar border border-light-border"
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 fill-current ${
                        theme === "dark"
                          ? "text-dark-primary"
                          : "text-light-primary"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`mb-4 ${
                    theme === "dark" ? "text-dark-infoText" : "text-light-info"
                  }`}
                >
                  "{testimonial.content}"
                </p>
                <div>
                  <p
                    className={`font-semibold ${
                      theme === "dark" ? "text-dark-text" : "text-light-text"
                    }`}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-dark-infoText"
                        : "text-light-info"
                    }`}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-dark-primary" : "bg-light-primary"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Ready to Build Your Dream Website?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 text-white/90"
          >
            Join thousands of creators who trust WebCraft to bring their ideas
            to life
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 ${
          theme === "dark"
            ? "bg-dark-sidebar border-t border-dark-border"
            : "bg-light-sidebar border-t border-light-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Palette
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-dark-primary" : "text-light-primary"
                }`}
              />
              <span
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-dark-text" : "text-light-text"
                }`}
              >
                WebCraft
              </span>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-dark-infoText" : "text-light-info"
              }`}
            >
              © 2025 WebCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
