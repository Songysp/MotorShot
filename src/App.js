import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import VideoAnalysisPage from './pages/VideoAnalysisPage';
import LiveCCTVPage from './pages/LiveCCTVPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/analysis" element={<VideoAnalysisPage />} />
        <Route path="/live-cctv" element={<LiveCCTVPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
