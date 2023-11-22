import React, { useRef } from "react";
import {
  Viewer,
  Designer,
} from "@grapecity/activereports-react";
import "@grapecity/activereports/styles/ar-js-ui.css";
import "@grapecity/activereports/styles/ar-js-viewer.css";
import "@grapecity/activereports/styles/ar-js-designer.css";

const DesignerPage = () => {
  const viewerRef = React.useRef();
  const [viewMode, setViewMode] = React.useState(false);
  const designerRef = useRef(null);
  const fileInputRef = useRef(null);

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
      downloadLink.download = "current-report.rdlx-json";

      // Append the link to the DOM, trigger the click event, and remove the link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("Report saved successfully.");
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  //THIS IS FOR SELECTING REPORTS FROM LOCAL 
  const openReportFromFile = (file) => {
    const reader = new FileReader();
  
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const reportDefinition = event.target.result;
        
        // Assuming 'viewerRef' is a reference to the Viewer component
        if (viewerRef.current) {
          // Open the report using the Viewer's open method
          viewerRef.current.Viewer.open(JSON.parse(reportDefinition));
          resolve();
        } else {
          reject(new Error('Viewer reference is not available.'));
        }
      };
  
      reader.onerror = (event) => {
        console.error("Error reading file:", event.target.error);
        reject(event.target.error);
      };
  
      reader.readAsText(file);
    });
  };
  
  const onFileInputChange = () => {
    const fileInput = fileInputRef.current;
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Call openReportFromFile and handle the promise if needed
      openReportFromFile(file)
        .then(() => {
          console.log('Report opened successfully.');
        })
        .catch((error) => {
          console.error('Error opening report:', error);
        });
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
          report={{ id: "current-report.rdlx-json", displayName: "my report" }}
        />
      </div>
      <div id="viewer-host" hidden={!viewMode}>
        <button onClick={switchToDesignerMode}>Switch to Designer Mode</button>
        <input type="file" ref={fileInputRef} onChange={onFileInputChange} />
        <Viewer ref={viewerRef} />
      </div>
    </div>
  )
}

export default DesignerPage