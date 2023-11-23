import React, { useState } from "react";
import { Viewer as ActiveReportsViewer } from "@grapecity/activereports-react";
import "@grapecity/activereports/pdfexport";
import "@grapecity/activereports/htmlexport";
import "@grapecity/activereports/tabulardataexport";

const Viewer = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewerVisible, setViewerVisible] = useState(true);

  const exportsSettings = {
    pdf: {
      title: "ActiveReportsJS Sample",
      author: "GrapeCity",
      subject: "Web Reporting",
      keywords: "reporting, sample",
      userPassword: "pwd",
      ownerPassword: "ownerPwd",
      printing: "none",
      copying: false,
      modifying: false,
      annotating: false,
      contentAccessibility: false,
      documentAssembly: false,
      pdfVersion: "1.7",
      autoPrint: true,
      filename: "ActiveReportsJS-Sample.pdf",
    },
    html: {
      title: "ActiveReportsJS Sample",
      filename: "ActiveReportsJS-Sample.html",
      autoPrint: true,
      multiPage: true,
      embedImages: "external",
      outputType: "html",
    },
  };
  const availableExports = ["pdf", "html", "tabular-data"];

  const reports = [
    { name: "Report 1", path: "../reports-testing/testing.rdlx-json" },
    { name: "Report 3", path: "../reports-testing/testing3.rdlx-json" },
  ];

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setViewerVisible(true); // Show the Viewer when a report is selected
  };

  const handleCloseViewer = () => {
    setViewerVisible(false); // Hide the Viewer
  };
  return (
    <div>
      <h1>Testing Viewer Page</h1>
      <ul>
        {reports.map((report, index) => (
          <li
            style={{ margin: "10px", cursor: "pointer" }}
            key={index}
            onClick={() => handleReportClick(report)}
          >
            {report.name}
          </li>
        ))}
      </ul>

      {/* ActiveReports Viewer */}
      {selectedReport && viewerVisible && (
        <div key={selectedReport.path}>
          <h2>{selectedReport.name}</h2>
          <button onClick={handleCloseViewer}>Close Viewer</button>
          <ActiveReportsViewer
            report={{ Uri: selectedReport.path }}
            exportsSettings={exportsSettings}
            availableExports={availableExports}
          />
        </div>
      )}
    </div>
  );
};

export default Viewer;
