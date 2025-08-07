import axios from "axios";
import { useEffect, useState } from "react";

function Production() {
  const [production, setProduction] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getAllLogs");
        setProduction(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error("Error fetching production data", err);
      }
    };
    fetchProduction();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(production);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = production.filter((row) =>
        Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, production]);

  // Choose which fields to display
  const displayFields = ["machineId", "line", "shift", "unitsProduced", "operator", "date"];

  return (
    <>
      {/* <Navbar /> */}
      <div className="p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 mt-12">Production Data</h1>

        {/* Search Bar + Export Button */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            className="border mb-10 px-6 py-4 rounded w-full sm:w-1/3"
            placeholder="Search production..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div id="production-table" className="overflow-auto rounded-lg border shadow-sm">
          {filteredData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="">
                <tr>
                  {displayFields.map((key) => (
                    <th key={key} className="px-4 py-2 border-b font-semibold">
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="even:bg-gray-500">
                    {displayFields.map((key) => (
                      <td key={key} className="px-4 py-2 border-b">
                        {key === "date"
                          ? new Date(item[key]).toLocaleDateString()
                          : item[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 mt-1.5">No production data found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Production;





