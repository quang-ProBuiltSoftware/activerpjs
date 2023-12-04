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

export async function fetchReport(ReportCode, ReportVariation) {
  const { data } = await customAxios().get(
    `/v3/Reporting/SystemReports?ReportCode=${ReportCode}&ReportVariation=${ReportVariation}`
  );
  return data;
}

export async function saveReport(
  ReportCode,
  ReportVariation,
  ReportName,
  ReportJSON
) {
  const formData = new FormData();
  formData.append("ReportJSON", ReportJSON);

  const { data } = await customAxios().post(
    `/v3/Reporting/SystemReports?ReportCode=${ReportCode}&ReportVariation=${ReportVariation}&ReportName=${ReportName}`,
    formData
  );
  return data;
}

export async function patchReport(
  ReportCode,
  ReportVariation,
  ReportName,
  UpdatedReportJSON
) {
  const formData = new FormData();
  formData.append("ReportJSON", UpdatedReportJSON);

  const { data } = await customAxios().patch(
    `/v3/Reporting/SystemReports?ReportCode=${ReportCode}&ReportVariation=${ReportVariation}&ReportName=${ReportName}`,
    formData
  );
  return data;
}

