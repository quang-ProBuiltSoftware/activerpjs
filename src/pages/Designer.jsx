import React, { useRef } from "react";
import { Viewer, Designer } from "@grapecity/activereports-react";
import "@grapecity/activereports/styles/ar-js-ui.css";
import "@grapecity/activereports/styles/ar-js-viewer.css";
import "@grapecity/activereports/styles/ar-js-designer.css";

const DesignerPage = () => {
  const viewerRef = React.useRef();
  const [designerVisible, setDesignerVisible] = React.useState(true);
  const designerRef = useRef(null);
  const fileInputRef = useRef(null);

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
          reject(new Error("Viewer reference is not available."));
        }
      };

      reader.onerror = (event) => {
        console.error("Error reading file:", event.target.error);
        reject(event.target.error);
      };

      reader.readAsText(file);
    });
  };

  // eslint-disable-next-line
  const onFileInputChange = () => {
    const fileInput = fileInputRef.current;
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Call openReportFromFile and handle the promise if needed
      openReportFromFile(file)
        .then(() => {
          console.log("Report opened successfully.");
        })
        .catch((error) => {
          console.error("Error opening report:", error);
        });
    }
  };

  function updateToolbar(){
    var designButton = {
      key: "$openDesigner",
      text: "Edit in Designer",
      iconCssClass: "mdi mdi-pencil",
      enabled: true,
      action: () => {
        setDesignerVisible(true);
      },
    };
    viewerRef.current.toolbar.addItem(designButton);
    viewerRef.current.toolbar.updateLayout({
      default: [
        "$openDesigner",
        "$split",
        "$navigation",
        "$split",
        "$refresh",
        "$split",
        "$history",
        "$split",
        "$zoom",
        "$fullscreen",
        "$split",
        "$print",
        "$split",
        "$singlepagemode",
        "$continuousmode",
        "$galleymode",
      ],
    });
  }

  function onReportPreview(report) {
    updateToolbar();
    // Modify the report with additional data
    report.definition.DataSources[0].ConnectionProperties.ConnectString = `endpoint=${process.env.REACT_APP_BASE_URI};Header$AK=${process.env.REACT_APP_AK};Header$CID=${process.env.REACT_APP_CID};Header$User=Quang;Header$ClientPlatform=Edge`;

    // Hide the Designer and show the Viewer
    setDesignerVisible(false);

    // Open the modified report in the Viewer
    viewerRef.current.Viewer.open(report.definition);
    return Promise.resolve();
  }

  return (
    <div id="app-host">
      <div
        id="viewer-host"
        style={{ display: designerVisible ? "none" : "block" }}
      >
        <Viewer ref={viewerRef} />
      </div>
      <div
        id="designer-host"
        style={{ display: designerVisible ? "block" : "none" }}
      >
        <Designer
          ref={designerRef}
          report={{ id: "CustomerList.rdlx-json" }}
          onRender={onReportPreview}
          onSave={onSaveAs}
          onSaveAs={onSaveAs}
        />
      </div>
      {/* <input type="file" ref={fileInputRef} onClick={onFileInputChange}></input> */}
    </div>
  );
};

export default DesignerPage;
