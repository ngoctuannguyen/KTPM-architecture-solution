import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShortUrl from "./pages/ShortUrl";
import NotFound from "./components/NotFound";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route chính */}
        <Route path="/" element={<ShortUrl />} />

        {/* Xử lý lỗi 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
