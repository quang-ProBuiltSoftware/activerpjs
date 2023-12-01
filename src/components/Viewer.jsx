import React from "react";
import { Viewer as ActiveReportsViewer } from "@grapecity/activereports-react";
import "@grapecity/activereports/pdfexport";
import "@grapecity/activereports/htmlexport";
import "@grapecity/activereports/tabulardataexport";

const Viewer = () => {
  const viewerRef = React.useRef();
  const [currentReportVersion, setCurrentReportVersion] = React.useState("");

  async function loadReport(size) {
      const reportResponse = await fetch(
        `CustomerList${size}.rdlx-json`
      );
      const report = await reportResponse.json();

      return report;
  }

  function updateToolbar() {
    var designButton = {
      key: "$switchMode",
      text: "Switch Mode",
      enabled: true,
      action: () => {
        // Toggle between versions (assuming you have only two versions)
        const nextVersion = currentReportVersion === "" ? "_w" : "";
        setCurrentReportVersion(nextVersion);

        // Load the new version of the report
        openReport(nextVersion);
      },
    };
    viewerRef.current.toolbar.addItem(designButton);
  }

  async function openReport(size) {
    const report = await loadReport(size);
    report.DataSources[0].ConnectionProperties.ConnectString = `endpoint=${process.env.REACT_APP_BASE_URI};Header$AK=${process.env.REACT_APP_AK};Header$CID=${process.env.REACT_APP_CID};Header$User=${process.env.REACT_APP_USER};Header$ClientPlatform=Edge`;
    viewerRef.current.Viewer.open(report);
  }

  React.useEffect(() => {
    async function initializeViewer() {
      updateToolbar();
      // Initially load the default version of the report
      openReport(currentReportVersion);
    }

    initializeViewer();
    // eslint-disable-next-line
  }, [currentReportVersion]);

  return (
    <div id="viewer-host">
      <ActiveReportsViewer ref={viewerRef} />
    </div>
  );
};

export default Viewer;
