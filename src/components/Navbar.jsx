import React from "react";
import { ResizableNavbar } from "./ui/ResizableNavbar";

const Navbar = () => {
  const navItems = [
    { name: "Home", link: "#home" },
    {
      name: "Stats",
      children: [
        { name: "User Info", id: "userInfo" },
        { name: "Rating Stats", id: "RatingStats" },
        { name: "Recent Submissions", id: "RecentSubmissions" },
        { name: "Problem Solved", id: "ProblemSolved" },
      ],
    },
    { name: "About", link: "#about" },
  ];

  const logo = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
        CT
      </div>
      <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
        CodeTrackr
      </span>
    </div>
  );

  return <ResizableNavbar navItems={navItems} logo={logo} />;
};

export default Navbar;
