import axios from "axios";
import { useEffect, useState } from "react";
// import Navbar from "./Navbar";

function MachineDownTime() {
  const [downtime, setDowntime] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const displayFields = [
    "machineId",
    "reason",
    "shift",
    "startTime",
    "endTime",
    "duration",
    "operator",
  ];

  // Fetch downtime data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getAllDownTime");
        setDowntime(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error("Error fetching downtime data:", err);
      }
    };
    fetchData();
  }, []);

  // Filter on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(downtime);
    } else {
      const lower = search.toLowerCase();
      const filtered = downtime.filter((entry) =>
        Object.values(entry).some((val) =>
          val?.toString().toLowerCase().includes(lower)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, downtime]);


 return (
  <>
    {/* <Navbar /> */}
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Machine Downtime</h1>

      {/* Search & Export */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full sm:w-1/3"
          placeholder="Search downtime logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Conditional Table Rendering */}
      {filteredData.length > 0 ? (
        <div
          id="downtime-table"
          className="overflow-auto border rounded-lg shadow"
        >
          <table className="w-full text-sm text-left table-auto">
            <thead className="">
              <tr>
                {displayFields.map((field) => (
                  <th key={field} className="px-4 py-2 border-b font-medium">
                    {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr key={index} className="even:bg-gray-500">
                  {displayFields.map((field) => (
                    <td key={field} className="px-4 py-2 border-b">
                      {field === "date"
                        ? new Date(entry[field]).toLocaleDateString()
                        : field.includes("Time")
                        ? new Date(entry[field]).toLocaleTimeString()
                        : entry[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-600 rounded shadow border border-dashed border-gray-300 bg-gray-50">
          No downtime records found.
        </div>
      )}
    </div>
  </>
);
}


export default MachineDownTime;