import React, { useContext, useState, useMemo, useEffect } from "react";
import { APIContext } from "../../utils/context/APIContextProvider";
import Back from "../../components/Back";
import { ClipboardListIcon, ChevronLeft, ChevronRight } from "lucide-react";
import LogsTable from "../../components/LogsTable";

const SystemLogs = () => {
  const { logsSystem } = useContext(APIContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndPaginatedLogs = useMemo(() => {
    const filteredLogs = logsSystem.filter(log => 
      Object.values(log).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    const startIndex = (currentPage - 1) * logsPerPage;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

    return {
      currentLogs,
      totalPages,
      totalFilteredLogs: filteredLogs.length
    };
  }, [logsSystem, currentPage, logsPerPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, logsPerPage]);

  const renderPaginationControls = () => {
    const { totalPages } = filteredAndPaginatedLogs;

    return (
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 text-gray-800 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`} 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            className={`p-2 text-gray-800 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="text-gray-700 font-bold">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="logsPerPage" className="text-sm text-gray-600">
            Logs per page:
          </label>
          <select
            id="logsPerPage"
            value={logsPerPage}
            onChange={(e) => setLogsPerPage(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <Back />

      <div className="bg-gray-900 text-white p-4 mb-6 font-semibold rounded-sm text-lg">
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardListIcon className="mr-3 text-white" />
          System Logs
        </h1>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {logsSystem.length > 0 ? (
          <div>
            <LogsTable logs={filteredAndPaginatedLogs.currentLogs} />

            {renderPaginationControls()}

            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredAndPaginatedLogs.currentLogs.length} of {filteredAndPaginatedLogs.totalFilteredLogs} logs
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <ClipboardListIcon className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No logs available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;