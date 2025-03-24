import { motion } from 'framer-motion';
const ConfirmAction = ({ isOpen, onClose, onConfirm, actionType }) => {
    if (!isOpen) return null;

    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h2 className="text-xl font-bold mb-4">Confirm {actionType}</h2>
          <p>Are you sure you want to {actionType} this user?</p>
          <div className="flex justify-end gap-4 mt-6">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={onConfirm} className={`px-4 py-2 ${actionType === 'delete' ? 'bg-red-500' : 'bg-yellow-400'} text-white rounded`}>{actionType}</button>
          </div>
        </motion.div>
      </motion.div>
    );
}

export default ConfirmAction