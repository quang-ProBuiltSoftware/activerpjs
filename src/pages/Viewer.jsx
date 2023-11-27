import React from "react";
import { Viewer as ActiveReportsViewer } from "@grapecity/activereports-react";
import "@grapecity/activereports/pdfexport";
import "@grapecity/activereports/htmlexport";
import "@grapecity/activereports/tabulardataexport";

async function loadReport() {
 const reportResponse = await fetch("CustomerList.rdlx-json");

  const report = await reportResponse.json();
  return report;
}

const Viewer = () => {
  const viewerRef = React.useRef();

  React.useEffect(() => {
    async function openReport() {
      const report = await loadReport();
      report.DataSources[0].ConnectionProperties.ConnectString = `endpoint=${process.env.REACT_APP_BASE_URI};Header$AK=${process.env.REACT_APP_AK};Header$CID=${process.env.REACT_APP_CID};Header$User=Quang;Header$ClientPlatform=Edge`
      viewerRef.current.Viewer.open(report);
    }
    openReport();
  }, []);

  return (
    <div id="viewer-host">
      <ActiveReportsViewer ref={viewerRef} />
    </div>
  );
};

export default Viewer;
