import { AlertCircleIcon, ClipboardListIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const LogDetailModal = ({ log, onClose }) => {
  const parseFullLogDetails = (logInput) => {
    // If logInput is already an object with parsed details, return it
    if (typeof logInput === 'object' && logInput !== null) {
      return logInput;
    }

    // If logInput is a string, parse it
    if (typeof logInput === 'string') {
      const regex = /^\[(.*?)\] (\w+) \| (\w+) \| (.*)$/;
      const match = logInput.match(regex);

      if (match) {
        const [, timestamp, level, category, message] = match;
        
        const details = {};
        const messageTokens = message.split(', ');
        
        messageTokens.forEach(token => {
          const [key, value] = token.split('=');
          if (key && value) {
            details[key.trim()] = value.trim();
          }
        });

        return {
          timestamp,
          level,
          category,
          message,
          details
        };
      }
    }

    return null;
  };

  const parsedLog = parseFullLogDetails(log);

  if (!parsedLog) return null;

  return (
    <>
        <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onclose}
        />
        <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    {parsedLog.level === "WARNING" ? (
                        <AlertCircleIcon className="text-yellow-500 w-6 h-6 mr-2" />
                    ) : (
                        <ClipboardListIcon className="text-gray-500 w-6 h-6 mr-2" />
                    )}
                        Log Details
                    </h2>
                    <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-gray-700">
                    <XIcon className="w-6 animate-bounce h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Timestamp</p>
                        <p className="text-gray-900">{parsedLog.timestamp}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Level</p>
                        <p className={`font-semibold ${
                        parsedLog.level === 'WARNING' 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                        }`}>
                        {parsedLog.level}
                        </p>
                    </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium text-gray-600">Full Message</p>
                        <p className="text-gray-900">{parsedLog.message}</p>
                    </div>

                    {parsedLog.details && Object.keys(parsedLog.details).length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-600">Details</p>
                        <div className="bg-gray-100 p-4 rounded-md">
                        {Object.entries(parsedLog.details).map(([key, value]) => (
                            <div key={key} className="mb-2">
                            <span className="font-medium text-gray-700 mr-2">
                                {key}:
                            </span>
                            <span className="text-gray-900">{value}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                </div>

            </div>

            <span className="text-gray-800 flex flex-col gap-1 mt-6">
                <span>Copy the Claim Number to look it up</span>
                <Link to={'/staff/claim/verify/'} className="underline text-blue-700">look it up here</Link>
            </span>
        </motion.div>
    </>
  );
};

export default LogDetailModal;