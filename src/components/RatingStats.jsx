import React from "react";

const RatingStatsTable = ({ ratingData }) => {
  if (!ratingData || ratingData.length === 0) return null;

  return (
    <div
      id="RatingStats"
      className="w-full glass-panel rounded-2xl overflow-hidden animate-fade-in-up"
    >
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/30">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Contest Performance
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-200 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Contest</th>
              <th className="px-6 py-4 text-center">Rank</th>
              <th className="px-6 py-4 text-center">Old Rating</th>
              <th className="px-6 py-4 text-center">New Rating</th>
              <th className="px-6 py-4 text-center">Change</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ratingData
              .slice()
              .reverse()
              .map((entry, index) => {
                const change = entry.newRating - entry.oldRating;
                const date = new Date(
                  entry.ratingUpdateTimeSeconds * 1000
                ).toLocaleDateString();

                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200">
                      <div className="flex flex-col">
                        <span
                          className="text-white hover:text-blue-400 transition-colors cursor-pointer"
                          title={entry.contestName}
                        >
                          {entry.contestName}
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          ID: {entry.contestId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300 font-mono">
                      #{entry.rank}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {entry.oldRating}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-white font-mono">
                      {entry.newRating}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          change > 0
                            ? "bg-green-500/10 text-green-400"
                            : change < 0
                            ? "bg-red-500/10 text-red-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {date}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatingStatsTable;
