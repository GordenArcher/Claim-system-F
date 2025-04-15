import React from 'react';
import { motion } from 'framer-motion';

const AuditView = ({ selectedClaim, closeModal, formatDate, renderChanges }) => {
  // Helper function to get action colors
  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-slate-400 to-gray-500 p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Audit Log</h2>
              <p className="text-indigo-200 text-sm">
                {formatDate(selectedClaim.timestamp)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(selectedClaim.action)}`}>
              {selectedClaim.action}
            </span>
          </div>
        </div>

        {/* User info section */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-slate-400 to-gray-500 flex items-center justify-center">
              <span className="text-white font-bold">{selectedClaim.user?.username?.charAt(0) || selectedClaim?.full_name.charAt(0)}</span>
            </div>
            <div>
                <p className="font-medium">{selectedClaim?.user?.username || selectedClaim?.full_name}</p>
                { selectedClaim?.user?.email &&
                    <p className="text-sm text-gray-500">{selectedClaim?.user.email || null}</p>
                }
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Entity Information
          </h3>
          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Entity Type</p>
                <p className="font-medium">{selectedClaim.entity_type}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Entity ID</p>
                <p className="font-medium">{selectedClaim.entity_id}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Log ID</p>
              <p className="font-medium">{selectedClaim.id}</p>
            </div>
          </div>

          {/* Changes section */}
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Changes Made
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
            {renderChanges(selectedClaim.changes)}
          </div>
        </div>

        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={closeModal}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default AuditView;