import React from 'react';
import { motion } from 'framer-motion';

const ErrorNotification = ({ errorData, onDismiss }) => {
  const { status, message, claim } = errorData;
  
  return (
    <motion.div
      className="fixed top-0 right-0 p-4 z-50 flex justify-end"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md border-l-4 border-red-500">
        <div className="px-4 py-3 bg-red-50 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {status.toUpperCase()} - {message}
              </h3>
            </div>
          </div>
          <button 
            onClick={onDismiss} 
            className="text-red-500 hover:text-red-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-4 py-3">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">Duplicate Claim Details:</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-500">Claim Number</p>
                <p className="font-medium">{claim.claim_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-medium">GHc {Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{claim.full_name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-500">Staff Number</p>
                <p className="font-medium">{claim.staff_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{claim.phone_number}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-500">Status</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  {claim.status}
                </span>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{new Date(claim.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onDismiss}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Dismiss
          </button>
          <button
            className="px-3 py-1.5 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
          >
            View Existing Claim
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorNotification;