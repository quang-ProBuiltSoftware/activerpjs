import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL: process.env.REACT_APP_BASE_URI,
    headers: {
      Ak: process.env.REACT_APP_AK,
      Cid: process.env.REACT_APP_CID,
      User: process.env.REACT_APP_USER,
      ClientPlatform: "all",
      ClientTime: new Date().toISOString(),
    },
  });

export async function fetchReportsList() {
  const { data } = await customAxios().get(
    `/v3/Reporting/SystemReports/GetList`
  );
  return data;
}

export async function fetchReports(ReportCode, ReportVariation) {
  const { data } = await customAxios().get(
    `/v3/Reporting/SystemReports?ReportCode=${ReportCode}&ReportVariation=${ReportVariation}`
  );
  return data;
}
