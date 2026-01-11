import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (event) => {
    const targetId = event.target.value;
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Offset for the fixed navbar
        const yOffset = -80;
        const y =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              CT
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CodeTrackr
            </span>
          </div>

          <ul className="flex items-center gap-8">
            <li>
              <a
                href="#home"
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
              >
                Home
              </a>
            </li>
            <li className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
              <select
                onChange={handleNavigation}
                className="relative bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer text-sm font-medium hover:text-white transition-colors"
                style={{ backgroundImage: "none" }}
              >
                <option value="" disabled selected>
                  Jump to Section
                </option>
                <option value="userInfo">User Info</option>
                <option value="RatingStats">Rating Stats</option>
                <option value="RecentSubmissions">Recent Submissions</option>
                <option value="ProblemSolved">Problem Solved</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </li>
            <li>
              <a
                href="#about"
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm uppercase tracking-wide"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
