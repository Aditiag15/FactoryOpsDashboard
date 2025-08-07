import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./ChartDisplay.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ChartDisplay = ({ from, to }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!from || !to) return;

    axios.get("http://localhost:5000/api/users/shift", {
      params: { from, to }
    })
      .then((res) => {
        const data = Array.isArray(res.data.performance) ? res.data.performance : res.data;
        if (!Array.isArray(data) || data.length === 0) return;

        const labels = data.map(item => item.shift);
        const units = data.map(item => item.unitsProduced);
        const downtime = data.map(item => item.downtime);
        const defects = data.map(item => item.defectiveUnits);

        setChartData({
          labels,
          datasets: [
            { label: "Units Produced", data: units, backgroundColor: "#38bdf8" },
            { label: "Downtime (mins)", data: downtime, backgroundColor: "#facc15" },
            { label: "Defective Units", data: defects, backgroundColor: "#ef4444" }
          ]
        });
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
      });
  }, [from, to]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#ffffff" } },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-card">
        <h2 className="chart-title">Shiftwise Performance</h2>
        {chartData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p className="loading">Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;
