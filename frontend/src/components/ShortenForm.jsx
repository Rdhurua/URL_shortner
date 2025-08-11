import React, { useState } from 'react';
import axios from 'axios';

export default function ShortenForm() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (!longUrl) {
      setError('Please enter a URL.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE}/api/shorten`, { originalUrl: longUrl });
      setShortUrl(`${import.meta.env.VITE_BACKEND_BASE}/${res.data.shortCode}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 relative">

  <div className="absolute top-4 right-4">
    <a
      href="/admin"
      className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg transition"
    >
      🔑 Only Admin
    </a>
  </div>
 <div>
  
 </div>
  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 text-center">
    Hey! Shorten Your URL
  </h1>
  <p className="text-gray-800 mb-6 text-center text-sm sm:text-base">
    Paste your long link below and get a short, shareable one instantly.
  </p>

  {/* Card */}
  <div className="w-full max-w-lg p-18 rounded-2xl shadow-lg bg-white">
    {/* Form */}
  <form
  onSubmit={handleSubmit}
  className="flex flex-col gap-4 mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100"
>
  {/* Label */}
  <label
    htmlFor="in"
    className="text-base font-semibold text-gray-800"
  >
    🔗 Enter your long link
  </label>

  {/* Input */}
  <input
    id="in"
    type="url"
    placeholder="https://example.com/super/long/link"
    value={longUrl}
    onChange={(e) => setLongUrl(e.target.value)}
    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
    required
  />

  {/* Button */}
  <button
    type="submit"
    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
  >
    🚀 Shorten URL
  </button>
</form>



    {/* Error */}
    {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

    {/* Result */}
    {shortUrl && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
        <p className="text-green-800 font-medium">
          Short URL:{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline hover:text-green-900"
          >
            {shortUrl}
          </a>
        </p>
      </div>
    )}
  </div>
</div>

  );
}
