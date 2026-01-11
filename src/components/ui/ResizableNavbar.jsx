"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils"; // Assuming you might have a utils file, if not I'll create it or inline cn
import { Menu, X, ChevronDown } from "lucide-react";

// Inline cn utility if not present
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const ResizableNavbar = ({ className, navItems = [], logo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.div
      initial={{
        width: "100%",
        y: 0,
        borderRadius: 0,
      }}
      animate={{
        width: scrolled ? "fit-content" : "100%",
        y: scrolled ? 20 : 0,
        borderRadius: scrolled ? "2rem" : "0",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className={classNames(
        "fixed top-0 left-0 right-0 mx-auto z-50 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 py-3 transition-all",
        scrolled
          ? "shadow-2xl shadow-blue-500/10"
          : "border-b border-b-white/5",
        className
      )}
      style={{
        maxWidth: scrolled ? "90%" : "100%",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-8">{logo}</div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.children ? (
              <div className="relative group px-3 py-2 cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {item.name}
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left translate-y-2 group-hover:translate-y-0 shadow-xl">
                  {item.children.map((child, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => handleScrollTo(child.id)}
                      className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      {child.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <a
                href={item.link}
                onClick={(e) => {
                  if (item.link.startsWith("#")) {
                    e.preventDefault();
                    handleScrollTo(item.link.substring(1));
                  }
                }}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                )}
              >
                {item.name}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Action Button (e.g. Contact) */}
      <div className="hidden md:block ml-4">
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo("contact");
          }}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
        >
          Contact
        </a>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2 text-slate-300 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col gap-2 md:hidden"
          >
            {navItems.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                {item.children ? (
                  <>
                    <div className="px-4 py-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {item.name}
                    </div>
                    {item.children.map((child, cIdx) => (
                      <div
                        key={cIdx}
                        onClick={() => handleScrollTo(child.id)}
                        className="px-4 py-2 text-base text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                      >
                        {child.name}
                      </div>
                    ))}
                  </>
                ) : (
                  <a
                    href={item.link}
                    onClick={(e) => {
                      if (item.link.startsWith("#")) {
                        e.preventDefault();
                        handleScrollTo(item.link.substring(1));
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
            <div className="h-px bg-slate-800 my-2" />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo("contact");
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-5 py-3 rounded-xl bg-blue-600 text-white font-bold"
            >
              Contact Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
