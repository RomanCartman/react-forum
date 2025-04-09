import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
