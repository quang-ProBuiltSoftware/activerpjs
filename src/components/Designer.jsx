import React, { useEffect, useRef, useState } from "react";
import { Viewer, Designer } from "@grapecity/activereports-react";
import { useParams } from "react-router-dom";
import { fetchReport, patchReport, saveReport } from "../api";
import { reportList } from "../helper";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const DesignerPage = () => {
  const viewerRef = React.useRef();
  const [designerVisible, setDesignerVisible] = React.useState(true);
  const designerRef = useRef(null);
  const fileInputRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState();

  const openSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
    setErrorMessage("");
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setErrorMessage("");
  };

  //SAVE to API
  const saveToAPI = async () => {
    try {
      if (!designerRef.current) {
        console.error("Designer is not available.");
        return;
      }
      // Check if the designer is ready by waiting for a short time (adjust as needed)
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Get the current report from the designer
      const report = await designerRef.current.getReport();
      // Convert the report to JSON string
      const reportJSON = JSON.stringify(report.definition);
      // Call the saveReport function
      await saveReport(selectedCategory, reportType, reportName, reportJSON);

      /////THIS BLOCK IS TO SAVE A COPY TO LOCAL, WILL REMOVE IF NOT NEEDED
      // Create a Blob from the JSON string
      const blob = new Blob([reportJSON], { type: "application/json" });
      // Create a link element and trigger a download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      // Set the file name (you can customize the file name here)
      downloadLink.download = `${reportName}.rdlx-json`;
      // Append the link to the DOM, trigger the click event, and remove the link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      /////THIS BLOCK IS TO SAVE A COPY TO LOCAL, WILL REMOVE IF NOT NEEDED

      closeSaveModal();
    } catch (error) {
      console.error("An error occurred while saving the report:", error);
      // Handle the error as needed (e.g., display an error message to the user)
      const errorMessage =
        error.message || "An error occurred while saving the report.";
      setErrorMessage(errorMessage);
    }
  };

  const updateToAPI = async () => {
    try {
      if (!designerRef.current) {
        console.error("Designer is not available.");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      const report = await designerRef.current.getReport();
      const updatedReportJSON = JSON.stringify(report.definition);

      // Call the updateReport function
      await patchReport(
        selectedCategory,
        reportType,
        reportName,
        updatedReportJSON
      );

      /////THIS BLOCK IS TO SAVE A COPY TO LOCAL, WILL REMOVE IF NOT NEEDED
      // Create a Blob from the JSON string
      const blob = new Blob([updatedReportJSON], { type: "application/json" });
      // Create a link element and trigger a download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      // Set the file name (you can customize the file name here)
      downloadLink.download = `${reportName}.rdlx-json`;
      // Append the link to the DOM, trigger the click event, and remove the link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      /////THIS BLOCK IS TO SAVE A COPY TO LOCAL, WILL REMOVE IF NOT NEEDED

      closeUpdateModal();
    } catch (error) {
      console.error("An error occurred while updating the report:", error);
      // Handle the error as needed (e.g., display an error message to the user)
      const errorMessage =
        error.message || "An error occurred while updating the report.";
      setErrorMessage(errorMessage);
    }
  };

  //SAVE to LOCAL
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
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  //FOR SELECTING REPORTS FROM LOCAL
  const openReportFromFile = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const reportDefinition = event.target.result;
        const parsedReport = JSON.parse(reportDefinition);

        if (designerRef.current) {
          // Update the report using the setReport method
          designerRef.current.setReport({ definition: parsedReport });

          resolve();
        } else {
          reject(new Error("Designer reference is not available."));
        }
      };

      reader.onerror = (event) => {
        console.error("Error reading file:", event.target.error);
        reject(event.target.error);
      };

      reader.readAsText(file);
    });
  };

  function onFileInputChange() {
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
  }

  function updateToolbar() {
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
    //this is the order of the buttons on the toolbar
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

  function switchToPreview(report) {
    updateToolbar();
    // Modify the report with additional data
    report.definition.DataSources[0].ConnectionProperties.ConnectString = `endpoint=${process.env.REACT_APP_BASE_URI};Header$AK=${process.env.REACT_APP_AK};Header$CID=${process.env.REACT_APP_CID};Header$User=${process.env.REACT_APP_USER};Header$ClientPlatform=All`;
    // Hide the Designer and show the Viewer
    setDesignerVisible(false);
    // Open the modified report in the Viewer
    viewerRef.current.Viewer.open(report.definition);
    return Promise.resolve();
  }

  //FETCHING REPORT FROM API
  const fetchReportFromAPI = async () => {
    try {
      const res = await fetchReport(params.code, params.variation);
      if (designerRef.current) {
        // Assumed that we only have 1 report
        const parsedReport = JSON.parse(res.data.record[0].ReportJSON);

        // Set state values based on the fetched report
        setReportName(res.data.record[0].ReportName || "");
        setSelectedCategory(res.data.record[0].ReportCode || "");
        setReportType(res.data.record[0].ReportVariation || "");

        designerRef.current.setReport({ definition: parsedReport });
      } else {
        throw new Error("Designer reference is not available.");
      }
    } catch (error) {
      console.log(`Error fetching report: ${error}`);
    }
  };

  useEffect(() => {
    fetchReportFromAPI();
    // eslint-disable-next-line
  }, [params.code, params.variation]);

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
         <button
          onClick={()=>navigate("/")}
          className="bg-slate-800 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded mr-2"
        >
          Back Home
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        />
        <button
          onClick={openSaveModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mr-2"
        >
          Save as New
        </button>
        <button
          onClick={openUpdateModal}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded mr-2"
        >
          Save
        </button>
        <Designer
          ref={designerRef}
          onRender={switchToPreview}
          onSave={onSaveAs}
          onSaveAs={onSaveAs}
        />

        {/* MODAL */}
        <Dialog open={isSaveModalOpen} onClose={closeSaveModal} maxWidth="md" fullWidth>
          <DialogTitle>Select Options</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty // Allows an empty value to be displayed
              renderValue={(value) =>
                value === "" ? "Select Report Category" : value
              } // Custom rendering for the selected value
            >
              <MenuItem disabled value="">
                <em>Select Option</em>
              </MenuItem>
              {reportList.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              displayEmpty
              renderValue={(value) => (value === "" ? "Report Type" : value)}
            >
              <MenuItem disabled value="">
                <em>Report Type</em>
              </MenuItem>
              <MenuItem value="P">P</MenuItem>
              <MenuItem value="L">L</MenuItem>
            </Select>
            <Typography color="error">{errorMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={saveToAPI} color="primary">
              Save
            </Button>
            <Button onClick={closeSaveModal} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update MODAL */}
        <Dialog
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Update Report</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={reportName}
              // You might not need an onChange handler if the field is read-only
              // onChange={(e) => setReportName(e.target.value)}
              fullWidth
              margin="normal"
              disabled
            />
            <Select
              value={selectedCategory}
              // You might not need an onChange handler if the field is read-only
              // onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              renderValue={(value) =>
                value === "" ? "Select Report Category" : value
              }
              disabled
            >
              <MenuItem value={selectedCategory}>{selectedCategory}</MenuItem>
            </Select>

            <Select
              value={reportType}
              // You might not need an onChange handler if the field is read-only
              // onChange={(e) => setReportType(e.target.value)}
              displayEmpty
              renderValue={(value) => (value === "" ? "Report Type" : value)}
              disabled
            >
              <MenuItem value={reportType}>{reportType}</MenuItem>
            </Select>
            <Typography color="error">{errorMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={updateToAPI} color="primary">
              Update
            </Button>
            <Button onClick={closeUpdateModal} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DesignerPage;
