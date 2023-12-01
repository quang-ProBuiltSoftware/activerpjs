import React from "react";
import { Link } from "react-router-dom";
import DesignerPage from "../components/Designer";

const Home = () => {
  // Dummy data for the list of reports (replace this with actual API fetching later)
  const reports = [
    { id: 1, name: 'Report 1' },
    { id: 2, name: 'Report 2' },
    { id: 3, name: 'Report 3' },
  ];

  return (
    <div className="homepage">
      <h1>Reports List</h1>
      <ul>
        {reports.map(report => (
          <li key={report.id}>
            <Link to={`/designer/${report.id}`}>{report.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home