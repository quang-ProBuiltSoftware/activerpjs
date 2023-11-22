import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
   <div className="homepage">
        <h2>HOME</h2>
        <div className="flex">
            <Link to="/designer">Designer</Link>
            <Link to="/viewer">Viewer</Link>
        </div>
   </div>
  )
}

export default Home