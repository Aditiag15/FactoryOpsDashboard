import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import ChartDisplay from "./ChartDisplay";
import "./Dashboard.css";
import DefectRate from "./DefectRate";
import Downtime from "./Downtime";
import Navbar from "./Navbar";
import Production from "./Production";

function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");

  // Date filters shared across child and chart
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2025-12-31");

  useEffect(() => {
    axios.get("http://localhost:5000/report/users/export/csv")
      .then((res) => {
        const latest = res.data[res.data.length - 1]?.data || [];
        setData(latest);
        setFilteredData(latest);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:5000/report/users/export/csv", formData);
      alert("CSV uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to upload CSV.");
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = data.filter((row) =>
        Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  const getSummary = () => {
    if (filteredData.length === 0) return { total: 0, average: 0 };
    const keys = Object.keys(filteredData[0]);
    const valueKey = keys[1];
    const values = filteredData.map((item) => parseFloat(item[valueKey])).filter(Number.isFinite);
    const total = values.reduce((acc, curr) => acc + curr, 0);
    const average = total / values.length;
    return { total: total.toFixed(2), average: average.toFixed(2), key: valueKey };
  };

  const exportPDF = async () => {
    const doc = new jsPDF("p", "pt", "a4");
    const container = document.querySelector(".pdf-export-container");

    if (!container) return;
    container.classList.add("export-friendly");
    await new Promise((res) => setTimeout(res, 300));

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      doc.save("insightboard_dashboard.pdf");
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      container.classList.remove("export-friendly");
    }
  };

  const headers = filteredData.length ? Object.keys(filteredData[0]) : [];
  const { total, average, key } = getSummary();

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper pdf-export-container">
        <div className="csv-upload-row">
          <div className="csv-upload-container">
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload CSV</button>
          </div>
        </div>

        {/* Global Date Filter */}
        <div className="date-filter-row">
          <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
          <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
        </div>

        {filteredData.length > 0 && (
          <div className="filter-bar">
            <input
              type="text"
              className="filter-input"
              placeholder="Search in data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <h2 className="text-4xl mt-10 font-bold">Data Table</h2>
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {headers.map((h) => (
                  <td key={h}>{row[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Production from={fromDate} to={toDate} />
        <Downtime from={fromDate} to={toDate} />
        <DefectRate from={fromDate} to={toDate} />

        <h2 className="text-3xl font-bold mt-7">Chart</h2>
        <div className="chart-container">
          <ChartDisplay from={fromDate} to={toDate} />
        </div>

        <div className="export-buttons">
          <button onClick={exportPDF}>Export as PDF</button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
