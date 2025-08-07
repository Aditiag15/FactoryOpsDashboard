import axios from "axios";
import { useEffect, useState } from "react";

function DefectRate() {
  const [defects, setDefects] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const displayFields = [
    "shift",
    "totalUnits",
    "defectiveUnits",
    "defectRate",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/defectrate");

        const enhancedData = res.data.map(item => ({
          ...item,
          defectRate: item.defectRate.toFixed(2),
        }));

        setDefects(enhancedData);
        setFilteredData(enhancedData);
      } catch (err) {
        console.error("Error fetching defect rate data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(defects);
    } else {
      const lower = search.toLowerCase();
      const filtered = defects.filter((entry) =>
        Object.values(entry).some((val) =>
          val?.toString().toLowerCase().includes(lower)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, defects]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Defect Rate Logs</h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full sm:w-1/3"
          placeholder="Search defect logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Conditional Table Rendering */}
      {filteredData.length > 0 ? (
        <div className="overflow-auto border rounded-lg shadow">
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
                <tr key={index} className="even:bg-gray-500 text-left">
                  {displayFields.map((field) => (
                    <td key={field} className="px-4 py-2 border-b">
                      {field === "date"
                        ? new Date(entry[field]).toLocaleDateString()
                        : field === "defectRate"
                        ? `${entry[field]}%`
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
          No defect rate records found.
        </div>
      )}
    </div>
  );
}

export default DefectRate;


