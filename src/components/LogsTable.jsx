import { AnimatePresence } from "framer-motion";
import { AlertCircleIcon, ClipboardListIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { LogDetailModal } from "./LogDetailModal";

const LogsTable = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState(null);

  const parseLog = (log) => {
    const regex = /^\[(.*?)\] (\w+) \| (\w+) \| (.*)$/;
    const match = log.match(regex);

    if (match) {
      return {
        timestamp: match[1],
        level: match[2],
        category: match[3],
        message: match[4],
        fullLog: log, // Add the full log string to the parsed object
      };
    }
    return null;
  };

  const parsedLogs = logs.map(parseLog) 
    .filter((log) => log !== null);

  const getLevelIcon = (level) => {
    switch(level) {
      case "WARNING":
        return <AlertCircleIcon className="text-yellow-500 w-4 h-4 mr-2" />;
      case "ERROR":
        return <AlertCircleIcon className="text-red-500 w-4 h-4 mr-2" />;
      case "INFO":
        return <ClockIcon className="text-blue-500 w-4 h-4 mr-2" />;
      default:
        return <ClipboardListIcon className="text-gray-500 w-4 h-4 mr-2" />;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Level</th>
              <th className="py-3 px-6 text-left">Timestamp</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Message</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {parsedLogs.map((parsed, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6 flex items-center">
                  {getLevelIcon(parsed.level)}
                  {parsed.level}
                </td>
                <td className="py-3 px-6">{parsed.timestamp}</td>
                <td className="py-3 px-6">{parsed.category}</td>
                <td className="py-3 px-6">{parsed.message}</td>
                <td className="py-3 px-6">
                  <button onClick={() => setSelectedLog(parsed)} className="text-gray-600 cursor-pointer hover:text-gray-800">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedLog && (
          <LogDetailModal
            log={selectedLog} 
            onClose={() => setSelectedLog(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LogsTable;