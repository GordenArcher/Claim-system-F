import { motion } from "framer-motion";

const SelectedClaim = ({ selectedClaim, formatDate, closeModal }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl z-50 w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
      >
        <div className="bg-gradient-to-r from-slate-600 to-gray-200 p-6 text-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Claim #{selectedClaim.claim_number}</h2>
              <p className="text-slate-100 text-sm mt-1">
                Created on {formatDate(selectedClaim.created_at)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)}`}>
              {selectedClaim.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <p className="text-sm text-blue-700 font-medium mb-1">Amount</p>
            <p className="text-2xl font-bold text-blue-900">
              GHc{Number(selectedClaim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Staff Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium">{selectedClaim.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Employee Number</p>
                  <p className="font-medium">{selectedClaim.staff_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{selectedClaim.phone_number}</p>
                </div>
                <div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Claim Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="font-medium">{selectedClaim?.claim_reason}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date Paid</p>
                  <p className="font-medium">{selectedClaim.payment_date ? formatDate(selectedClaim.payment_date) : 'Not Paid Yet'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex space-x-3">
          <button onClick={closeModal} className="flex-1 bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default SelectedClaim;











// import { motion } from "framer-motion";

// const SelectedClaim = ({ selectedClaim, formatDate, closeModal }) => {
//   return (
//     <>
//       <motion.div
//         className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={closeModal}
//       />
//       <motion.div
//         className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 w-full max-w-md border border-gray-200"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//       >
//         {/* Header */}
//         <div className="mb-6 border-b pb-4 text-center">
//           <h2 className="text-xl font-bold text-gray-800">Claim</h2>
//           {/* <p className="text-xs text-gray-500">Generated on: {new Date().toLocaleDateString()}</p> */}
//         </div>

//         {/* Main Info */}
//         <div className="space-y-3 text-sm text-gray-700">
//           <div className="flex justify-between">
//             <span className="font-medium">Claim Number</span>
//             <span>{selectedClaim.claim_number}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-medium">Amount</span>
//             <span className="font-semibold text-gray-900">GH₵ {Number(selectedClaim.amount).toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-medium">Status</span>
//             <span className={selectedClaim.status === "paid" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
//               {selectedClaim.status}
//             </span>
//           </div>
//         </div>

//         {/* Staff Info */}
//         <div className="mt-6 space-y-2 text-sm text-gray-700 border-t pt-4">
//           <h3 className="font-semibold text-gray-800 text-sm mb-2">Staff Information</h3>
//           <div className="flex justify-between">
//             <span>Full Name</span>
//             <span>{selectedClaim.full_name}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Staff ID</span>
//             <span>{selectedClaim.staff_number}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Phone</span>
//             <span>{selectedClaim.phone_number}</span>
//           </div>

//         </div>

//         {/* Other Info */}
//         <div className="mt-6 space-y-2 text-sm text-gray-700 border-t pt-4">
//           <div className="flex justify-between">
//             <span>Date Created</span>
//             <span>{formatDate(selectedClaim.created_at)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Reason</span>
//             <span>{selectedClaim.claim_reason}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Payment Date</span>
//             <span>{selectedClaim.payment_date ? formatDate(selectedClaim.payment_date) : "Not Paid Yet"}</span>
//           </div>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={closeModal}
//           className="mt-6 bg-red-500 text-white text-sm px-4 py-2 rounded w-full hover:bg-red-600 transition"
//         >
//           Close
//         </button>
//       </motion.div>
//     </>
//   );
// };

// export default SelectedClaim;
