import React from "react";
import CodeTrackr from "./components/code";
import RatingStatsTable from "./components/RatingStats";
import UserProblemStats from "./components/UserProblemStats";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <CodeTrackr />

        {/* Sections wrapped for spacing and structure */}
        {/* These specific components need to be adjusted to not contain their own huge margins/wrappers if possible, 
            or handled here gracefully. For now, just placing them in the flow. */}
      </main>
      <Footer />
    </div>
  );
};

export default App;
