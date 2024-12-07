import { useState } from "react";
import React from "react";
import { createShortUrl, getOriginalUrl } from "../service/shortUrlService";

const ShortUrl: React.FC = () => {
  const [url, setUrl] = useState<string>(""); // URL gốc
  const [shortUrl, setShortUrl] = useState<string>(""); // Short URL
  const [shortId, setShortId] = useState<string>(""); // ID rút gọn
  const [error, setError] = useState<string>(""); // Thông báo lỗi

  // Hàm xử lý tạo short URL
  const handleCreateShortUrl = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setError("");

    try {
      const shortUrl = await createShortUrl(url); // Gọi service để tạo short URL
      setShortUrl(shortUrl);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Hàm xử lý lấy URL gốc
  const handleGetOriginalUrl = async () => {
    if (!shortId) {
      setError("Please enter a short ID");
      return;
    }

    setError("");

    try {
      const originalUrl = await getOriginalUrl(shortId); // Gọi service để lấy URL gốc
      console.log(originalUrl);
      if (!originalUrl) {
        setError("URL not found");
        return;
      }
      window.open(originalUrl, "_blank"); // Điều hướng đến URL gốc
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Short URL Service
      </h1>

      {/* Form để tạo Short URL */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Create Short URL
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateShortUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Short URL
          </button>
        </div>

        {shortUrl && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-md">
            <h2 className="font-medium">Your Short URL:</h2>
            <p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {shortUrl}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Form để lấy URL gốc */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Get Original URL
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Short ID"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
            className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGetOriginalUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Go to Original URL
          </button>
        </div>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
      )}
    </div>
  );
};

export default ShortUrl;
