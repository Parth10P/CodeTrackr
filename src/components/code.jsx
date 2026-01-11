import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import RatingStatsTable from "./RatingStats";
import RecentSubmissions from "./RecentSubmissions";
import UserProblemStats from "./UserProblemStats";

const rankColors = {
  newbie: "#808080",
  pupil: "#008000",
  specialist: "#03a89e",
  expert: "#0000ff",
  "candidate master": "#aa00aa",
  master: "#ff8c00",
  "international master": "#ff8c00",
  grandmaster: "#ff0000",
  "international grandmaster": "#ff0000",
  "legendary grandmaster": "#aa0000",
};

// Add rank thresholds
const rankThresholds = {
  newbie: 1200,
  pupil: 1400,
  specialist: 1600,
  expert: 1900,
  "candidate master": 2100,
  master: 2300,
  "international master": 2400,
  grandmaster: 2600,
  "international grandmaster": 3000,
};

const CodeTrackr = () => {
  const [handle, setHandle] = useState("");
  const [userData, setUserData] = useState(null);
  const [ratingData, setRatingData] = useState([]);
  const [ratingDataRaw, setRatingDataRaw] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    if (!handle.trim()) {
      setError("Please enter a Codeforces handle");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userRes = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const userJson = await userRes.json();
      if (userJson.status !== "OK") throw new Error("User not found");
      setUserData(userJson.result[0]);

      const ratingRes = await fetch(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const ratingJson = await ratingRes.json();
      if (ratingJson.status !== "OK")
        throw new Error("Rating data fetch error");

      const raw = ratingJson.result;
      setRatingDataRaw(raw);

      const transformed = raw.map((entry, index) => ({
        name: entry.contestName,
        rating: entry.newRating,
        index,
      }));
      setRatingData(transformed);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRatingData([]);
      setRatingDataRaw([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchUserData();
    }
  };

  return (
    <div id="userInfo" className="w-full space-y-8">
      {/* Hero / Search Section */}
      <div className="flex flex-col items-center justify-center pt-8 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-center">
          Track Your Progress
        </h1>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex shadow-2xl rounded-xl overflow-hidden bg-slate-900 border border-slate-700 p-1">
            <input
              type="text"
              placeholder="Enter Codeforces Handle..."
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent px-6 py-4 text-lg text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={fetchUserData}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-md bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* User Info Card */}
      {userData && (
        <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
              <img
                src={userData.titlePhoto}
                alt="User Avatar"
                className="relative w-40 h-40 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  <span style={{ color: rankColors[userData.rank] }}>
                    {userData.handle}
                  </span>
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-800 border border-slate-700 text-slate-300 capitalize">
                  {userData.rank || "Unrated"}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Rating
                  </p>
                  <p className="text-xl font-bold text-white">
                    {userData.rating}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Max Rating
                  </p>
                  <p className="text-xl font-bold text-blue-400">
                    {userData.maxRating}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Max Rank
                  </p>
                  <p className="text-sm font-bold text-white mt-1 capitalize">
                    {userData.maxRank}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Contribution
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      userData.contribution >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {userData.contribution > 0 ? "+" : ""}
                    {userData.contribution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating History Chart */}
      {ratingData.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 md:p-8 animate-fade-in-up delay-100">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
            Rating History
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={ratingData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="ratingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="index"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#475569" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#475569" }}
                  domain={[
                    (dataMin) => Math.floor((dataMin - 100) / 100) * 100,
                    (dataMax) => Math.ceil((dataMax + 100) / 100) * 100,
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f1f5f9",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#8b5cf6" }}
                  labelStyle={{ color: "#94a3b8", marginBottom: "0.25rem" }}
                />
                <Legend iconType="circle" />

                {Object.entries(rankThresholds).map(([rank, threshold]) => (
                  <ReferenceLine
                    key={rank}
                    y={threshold}
                    stroke={rankColors[rank]}
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                  />
                ))}

                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#ratingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Components */}
      {userData && (
        <div className="space-y-8 animate-fade-in-up delay-200">
          {ratingDataRaw.length > 0 && (
            <RatingStatsTable ratingData={ratingDataRaw} />
          )}
          <RecentSubmissions handle={userData.handle} />
          <UserProblemStats handle={userData.handle} />
        </div>
      )}
    </div>
  );
};

export default CodeTrackr;
