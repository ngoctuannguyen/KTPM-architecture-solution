import React, { useState } from "react";
import axios from "axios";

const GetOriginalUrl: React.FC = () => {
  const [shortId, setShortId] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/short/${shortId}`);
      setOriginalUrl(response.data);
    } catch (error) {
      console.error("Error fetching original URL:", error);
    }
  };

  return (
    <div>
      <h2>Get Original URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
          placeholder="Enter Short URL ID"
          required
        />
        <button type="submit">Get URL</button>
      </form>
      {originalUrl && <p>Original URL: {originalUrl}</p>}
    </div>
  );
};

export default GetOriginalUrl;
