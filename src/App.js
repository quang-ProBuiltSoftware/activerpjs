import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Viewer from "./pages/Viewer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DesignerPage from "./pages/Designer";

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/designer' element={<DesignerPage/>} />
      <Route path='/viewer' element={<Viewer/>} />
      </Routes>
    </Router>
  );
}

export default App;
