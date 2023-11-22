import React, { useRef } from "react";
import "./App.css";
import {
  Viewer as ReportViewer,
  Designer,
} from "@grapecity/activereports-react";
import "@grapecity/activereports/styles/ar-js-ui.css";
import "@grapecity/activereports/styles/ar-js-viewer.css";
import "@grapecity/activereports/styles/ar-js-designer.css";

function App() {
  const viewerRef = React.useRef();
  const [viewMode, setViewMode] = React.useState(false);
  const designerRef = useRef(null);

  const onRender = (report) => {
    setViewMode(true);
    viewerRef.current?.Viewer.open(report.definition);
    return Promise.resolve();
  };

  const switchToDesignerMode = () => {
    setViewMode(false);
  };

  const onSaveAs = async () => {
    try {
      // Ensure that the designer is available
      if (!designerRef.current) {
        console.error("Designer is not available.");
        return;
      }

      // Check if the designer is ready by waiting for a short time (adjust as needed)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the current report from the designer
      const report = await designerRef.current.getReport();

      // Convert the report to JSON string
      const reportJson = JSON.stringify(report.definition);

      // Create a Blob from the JSON string
      const blob = new Blob([reportJson], { type: "application/json" });

      // Create a link element and trigger a download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);

      // Set the file name (you can customize the file name here)
      downloadLink.download = "current-report.rdlc-json";

      // Append the link to the DOM, trigger the click event, and remove the link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("Report saved successfully.");
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const onOpenReport = async (fileName) => {
    try {
      // Ensure that the designer is available
      if (!designerRef.current) {
        console.error('Designer is not available.');
        return;
      }

      // Check if the designer is ready by waiting for a short time (adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Open the saved report in the designer
      await designerRef.current.open(fileName);

      console.log('Report opened successfully.');
    } catch (error) {
      console.error('Error opening report:', error);
    }
  };

  return (
    <div id="app-host">
      <div id="designer-host" hidden={viewMode}>
        <Designer
          ref={designerRef}
          onRender={onRender}
          onSaveAs={onSaveAs}
          onSave={(onSaveAs)}
          onOpen={onOpenReport}
        />
      </div>
      <div id="viewer-host" hidden={!viewMode}>
        <button onClick={switchToDesignerMode}>Switch to Designer Mode</button>
        <ReportViewer ref={viewerRef} />
      </div>
    </div>
  );
}

export default App;
