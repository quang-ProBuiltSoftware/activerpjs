import React from "react";
import Home from "./pages/Home";
import Viewer from "./components/Viewer";
import DesignerPage from "./components/Designer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designer/:code/:variation" element={<DesignerPage />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Router>
  );
}

export default App;
