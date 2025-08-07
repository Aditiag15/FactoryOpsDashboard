import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DefectRate from './components/DefectRate';
import Downtime from './components/Downtime';
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Production from './components/Production';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/production" element={<Production />} />
        <Route path="/downtime" element={<Downtime />} />
        <Route path="/defect" element={<DefectRate />} />
      </Routes>
    </Router>
  );
  console(React);
}

export default App;