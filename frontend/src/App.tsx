import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SceneInput } from './pages/SceneInput';
import { Practice } from './pages/Practice';
import { Review } from './pages/Review';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SceneInput />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
