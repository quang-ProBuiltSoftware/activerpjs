import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Dummy data for the list of reports (replace this with actual API fetching later)
  const reports = [
    { id: 1, name: "Report 1" },
    { id: 2, name: "Report 2" },
    { id: 3, name: "Report 3" },
  ];

  return (
    <div className="flex justify-start flex-col m-20">
      <h1 className="text-3xl font-bold underline mb-4">Reports List</h1>
      <ul className="list-none p-0">
        {/* reports should be a list from fetchReportsList  */}
        {/* each link should has its own report type, category */}
        {reports.map((report) => (
          <li key={report.id} className="mb-2">
            <Link
              to={`/designer`}
              className="text-blue-500 hover:underline"
            >
              {report.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
