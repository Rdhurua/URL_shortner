import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const params = new URLSearchParams(window.location.search);
  const initialKey = params.get("key") || "";
  const [key, setKey] = useState(initialKey);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  

  async function loadData() {
    setError("");
    if (!key.trim()) {
      setError("Enter admin key (or use ?key=...)");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE}/api/admin/urls?key=${encodeURIComponent(key)}`
      );
      setData(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }




  
  async function handleDelete(id) {
    if (!key.trim()) {
      setError("Admin key required");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE}/api/admin/${id}?key=${encodeURIComponent(key)}`
      );
      setData((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting URL");
    }
  }

  useEffect(() => {
    if (initialKey) loadData();
  }, []);

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    return (
      !q ||
      d.originalUrl.toLowerCase().includes(q) ||
      d.shortCode.toLowerCase().includes(q)
    );
  });

  async function copy(shortCode) {
    const url = `${import.meta.env.VITE_BACKEND_BASE}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(shortCode);
      setTimeout(() => setCopied(""), 2000);
    } catch (e) {
      setError("Copy failed: " + (e.message || e));
    }
  }

  function exportCSV() {
    if (!data.length) {
      setError("No data to export");
      return;
    }
    const headers = [
      "shortCode",
      "shortUrl",
      "originalUrl",
      "visits",
      "createdAt",
    ];
    //from outer sources
    const rows = data.map((d) => {
      const shortUrl = `${import.meta.env.VITE_BACKEND_BASE}/${d.shortCode}`;
      return [d.shortCode, shortUrl, d.originalUrl, d.visits, d.createdAt]
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "urls.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
   <div className="p-6 max-w-6xl mx-auto">
  {/* Top Bar */}
  <div className="flex justify-between items-center mb-6">
    <a
      href="/"
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
    >
      Home
    </a>
    <h2 className="text-3xl font-bold text-gray-800">Admin Actions </h2>
  </div>

  {/* Key & Actions */}
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    <div className="flex gap-2 mb-4">
      <input
        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Admin key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button
        onClick={loadData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Load
      </button>
      <button
        onClick={exportCSV}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export CSV
      </button>
    </div>

    {/* Search */}
    <div className="flex gap-2">
      <input
        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search shortcode or original URL"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={() => setSearch("")}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Clear
      </button>
    </div>
  </div>

  {error && <div className="text-red-500 mb-4">{error}</div>}

  {/* Table */}
  {loading ? (
    <div className="text-center py-10 text-gray-500">Loading...</div>
  ) : (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="text-left border-b px-4 py-2">Short</th>
            <th className="text-left border-b px-4 py-2">Original</th>
            <th className="text-left border-b px-4 py-2">Visits</th>
            <th className="text-left border-b px-4 py-2">Created</th>
            <th className="border-b px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((data, idx) => (
            <tr
              key={data._id}
              className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
            >
              <td className="px-4 py-2 border-b whitespace-nowrap">
                <a
                  href={`${import.meta.env.VITE_BACKEND_BASE}/${data.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {data.shortCode}
                </a>
              </td>
              <td
                className="px-4 py-2 border-b max-w-[300px] truncate"
                title={data.originalUrl}
              >
                <a
                  href={data.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  {data.originalUrl}
                </a>
              </td>
              <td className="px-4 py-2 border-b">{data.visits ?? 0}</td>
              <td className="px-4 py-2 border-b">
                {new Date(data.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b text-center space-x-2">
                <button
                  onClick={() => copy(data.shortCode)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(data._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                {copied === data.shortCode && (
                  <span className="text-green-600 ml-2">Copied!</span>
                )}
              </td>
            </tr>
          ))}
          {!filtered.length && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-4 text-center text-gray-500"
              >
                No URLs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
}
