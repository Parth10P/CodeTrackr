import React, { useEffect, useState } from "react";

const RecentSubmissions = ({ handle }) => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        setError(null);
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=15`
        );
        const data = await res.json();

        if (data.status !== "OK")
          throw new Error("Failed to fetch submissions");

        setSubmissions(data.result);
      } catch (err) {
        setError(err.message);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [handle]);

  const getVerdictStyle = (verdict) => {
    if (verdict === "OK")
      return "bg-green-500/10 text-green-400 border-green-500/20";
    if (verdict === "WRONG_ANSWER")
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (verdict === "TIME_LIMIT_EXCEEDED")
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (verdict === "COMPILATION_ERROR")
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const formatVerdict = (verdict) => {
    if (verdict === "OK") return "Accepted";
    return verdict
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div
      id="RecentSubmissions"
      className="w-full glass-panel rounded-2xl overflow-hidden animate-fade-in-up"
    >
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/30 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Recent Activity
        </h3>
        {loading && (
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/10 text-red-400 text-center text-sm">
          {error}
        </div>
      )}

      {submissions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/50 text-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4 text-center">Lang</th>
                <th className="px-6 py-4 text-center">Verdict</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {submissions.map((sub, i) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-200">
                        {sub.problem.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700">
                        {sub.problem.index}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {sub.problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-slate-500 bg-slate-800/50 px-1.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-slate-400">
                    {sub.programmingLanguage}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getVerdictStyle(
                        sub.verdict
                      )}`}
                    >
                      {formatVerdict(sub.verdict)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                    {new Date(
                      sub.creationTimeSeconds * 1000
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="p-8 text-center text-slate-500">
            No recent submissions found.
          </div>
        )
      )}
    </div>
  );
};

export default RecentSubmissions;
