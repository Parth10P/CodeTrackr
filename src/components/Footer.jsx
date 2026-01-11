import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm relative z-10 w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} CodeTrackr. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
