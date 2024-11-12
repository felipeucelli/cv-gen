import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';


function App() {
  return (
    <Router>
      <div style={{
        backgroundColor: '#F0F2F4',  
        padding: '8px',

      }}>
        <Routes>        
          <Route path="/:id" element={<Home />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
