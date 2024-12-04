import React, { useState } from "react";
import axios from "axios";

const CreateShortUrl: React.FC = () => {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/create?url=${encodeURIComponent(url)}`
      );
      setShortId(response.data.id);
    } catch (error) {
      console.error("Error creating short URL:", error);
    }
  };

  return (
    <div>
      <h2>Create Short URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Create</button>
      </form>
      {shortId && <p>Short URL ID: {shortId}</p>}
    </div>
  );
};

export default CreateShortUrl;
