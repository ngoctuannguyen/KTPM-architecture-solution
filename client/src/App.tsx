import { useState } from "react";
import "./App.css";
import { createShortUrl, getOriginalUrl } from "./service/shortUrlService";

function App() {
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
      window.open(originalUrl, "_blank"); // Điều hướng đến URL gốc
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Short URL Service</h1>

      {/* Form để tạo Short URL */}
      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleCreateShortUrl}>Create Short URL</button>
        </div>

        {shortUrl && (
          <div className="result">
            <h2>Your Short URL:</h2>
            <p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Form để lấy URL gốc */}
      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Short ID"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
          />
          <button onClick={handleGetOriginalUrl}>Go to Original URL</button>
        </div>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
