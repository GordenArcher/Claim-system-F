import React from 'react'
import { motion } from 'framer-motion'

const AuditView = ({selectedClaim, closeModal, formatDate, renderChanges}) => {
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            <h2 className="text-lg font-semibold mb-4">Claim Details</h2>
            <p><strong>Full Name: {selectedClaim.user.username}</strong></p>
            <p><strong>id:</strong> {selectedClaim.id}</p>
            <p><strong>entity_type:</strong> {selectedClaim.entity_type}</p>
            <p><strong>entity_id:</strong> {selectedClaim.entity_id}</p>
            <p><strong>Action:</strong> 
                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedClaim.action === 'create' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {selectedClaim.action}
                </span>
            </p>
            <p><strong>Email:</strong> {selectedClaim.user.email || "Not provided"}</p>
            <p><strong>Date Created:</strong> {formatDate(selectedClaim.timestamp)}</p>
            <p><strong>Changes:</strong> {renderChanges(selectedClaim.changes)}</p>
            <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
            Close
            </button>
        </motion.div>
    </>
  )
}

export default AuditView