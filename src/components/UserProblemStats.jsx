import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
];

const getUserSubmissions = async (username) => {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${username}`
  );
  const data = await response.json();
  if (data.status !== "OK") throw new Error("Failed to fetch submissions");
  return data.result;
};

const analyzeProblemTags = (submissions) => {
  const tagCount = {};
  submissions.forEach((sub) => {
    if (sub.verdict === "OK") {
      sub.problem.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });
  return Object.entries(tagCount).map(([name, value]) => ({ name, value }));
};

const analyzeProblemRatings = (submissions) => {
  const ratingCount = {};
  const seen = new Set();

  submissions.forEach((sub) => {
    if (
      sub.verdict === "OK" &&
      sub.problem.rating &&
      !seen.has(`${sub.problem.contestId}-${sub.problem.index}`)
    ) {
      ratingCount[sub.problem.rating] =
        (ratingCount[sub.problem.rating] || 0) + 1;
      seen.add(`${sub.problem.contestId}-${sub.problem.index}`);
    }
  });

  return ratingCount;
};

function UserProblemStats({ handle }) {
  const [tagStats, setTagStats] = useState([]);
  const [ratingStats, setRatingStats] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;

    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const submissions = await getUserSubmissions(handle);
        setTagStats(analyzeProblemTags(submissions));
        setRatingStats(analyzeProblemRatings(submissions));
      } catch (err) {
        setError("Invalid handle or failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [handle]);

  if (!handle) return null;

  const ratingArray = Object.entries(ratingStats)
    .map(([rating, count]) => ({ rating, count }))
    .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));

  return (
    <div id="ProblemSolved" className="w-full">
      <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
        <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></span>
        Problem Statistics
        <span className="w-12 h-1 bg-gradient-to-l from-blue-500 to-transparent rounded-full"></span>
      </h2>

      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-center mb-6 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tagStats.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-200 mb-6 text-center border-b border-slate-700/50 pb-4">
              Tag Distribution
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={2}
                    labelLine={false}
                  >
                    {tagStats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      color: "#f1f5f9",
                      borderRadius: "0.5rem",
                    }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {ratingArray.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-200 mb-6 text-center border-b border-slate-700/50 pb-4">
              Rating Breakdown
            </h3>

            {/* Rating Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-6 max-h-32 overflow-y-auto custom-scrollbar p-2">
              {ratingArray.map(({ rating, count }) => (
                <div
                  key={rating}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-default"
                >
                  <span className="text-blue-400">{rating}</span>: {count}
                </div>
              ))}
            </div>

            {/* Rating Bar Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingArray}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="rating"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#475569" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#475569" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      color: "#f1f5f9",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="count" name="Problems" radius={[4, 4, 0, 0]}>
                    {ratingArray.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProblemStats;
