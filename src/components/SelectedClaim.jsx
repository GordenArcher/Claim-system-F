
import { motion } from "framer-motion";

const SelectedClaim = ({ selectedClaim, formatDate, closeModal }) => {
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
            <p><strong>Claim Number:</strong> {selectedClaim.claim_number}</p>
            <p><strong>Amount:</strong> ${Number(selectedClaim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p><strong>Status:</strong> {selectedClaim.status}</p>
            <p><strong>Name:</strong> {selectedClaim.staff.employee.first_name} {selectedClaim.staff.employee.last_name}</p>
            <p><strong>Staff ID:</strong> {selectedClaim.staff.staff_id}</p>
            <p><strong>Phone:</strong> {selectedClaim.staff.phone_number}</p>
            <p><strong>Email:</strong> {selectedClaim.staff.employee.email || "Not provided"}</p>
            <p><strong>Date:</strong> {formatDate(selectedClaim.created_at)}</p>
            <p><strong>Reason:</strong> {selectedClaim.claim_reason}</p>
            <p><strong>Date Paid:</strong> {formatDate(selectedClaim.payment_date)}</p>
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

export default SelectedClaim