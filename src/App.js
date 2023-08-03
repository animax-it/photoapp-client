import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Upload from './Upload';
import Gallery from './Gallery';
import Home from './Home';

const App = () => {
  return (
    <Router>
     
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
};

export default App;
