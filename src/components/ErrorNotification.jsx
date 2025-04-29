import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorNotification = ({ errorData, onDismiss }) => {
  const { message, claims } = errorData;
  const [showDuplicates, setShowDuplicates] = useState(false);

  return (
    <motion.div
      className="fixed top-0 right-0 p-4 z-50 flex justify-end"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-white p-2 rounded-lg shadow-2xl overflow-hidden w-full max-w-xl border-l-4 border-red-500">
        <div className="px-4 py-3 bg-red-50 flex gap-1.5 justify-between items-center">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          <button onClick={() => setShowDuplicates(prev => !prev)} className="text-sm font-medium cursor-pointer text-slate-900">
            {showDuplicates ? 'Hide' : 'View'} Duplicates
          </button>
        </div>

        <AnimatePresence>
          {showDuplicates && (
            <motion.div
              className="px-4 py-3 max-h-[300px] overflow-y-auto space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>The duplicate(s) won't be saved</h2>
              {claims?.map((claim, i) => (
                <div key={i} className="border p-3 rounded bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Request Number</p>
                      <p className="font-medium">{claim}</p>
                    </div>
                </div>
                </div>
              ))}

            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-2 py-1 bg-gray-50x">
          <button onClick={onDismiss} className="w-full flex items-center justify-center gap-1.5 px-5 py-1.5 cursor-pointer bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700">
            <span>Dismiss</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorNotification;
