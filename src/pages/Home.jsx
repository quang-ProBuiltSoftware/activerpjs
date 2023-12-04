import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchReportsList } from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

const Home = () => {
  const [reports, setReports] = useState([]);

  const getAllReports = async () => {
    try {
      const res = await fetchReportsList();
      setReports(res.data.records);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <div className="flex justify-start flex-col m-20">
      <h1 className="text-3xl font-bold underline mb-4">Reports List</h1>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report Name</TableCell>
              <TableCell>Report Type</TableCell>
              <TableCell>Report Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.ReportName}</TableCell>
                <TableCell>{report.ReportVariation}</TableCell>
                <TableCell>{report.ReportCode}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/designer/${report.ReportCode}/${report.ReportVariation}`}
                    variant="outlined"
                    color="primary"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
