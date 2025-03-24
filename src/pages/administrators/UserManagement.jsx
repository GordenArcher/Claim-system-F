import React, { useState } from 'react';
import { APIContext } from '../../utils/context/APIContextProvider';
import Get_all_users from '../../api/Get_all_users';
import DeleteUser from '../../api/DeleteUser';
import BlockUser from '../../api/BlockUser';
import { Loader, Trash2, Lock, UserPlus, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import UserTable from '../../components/UserTable';
import Register from '../auth/Register';
import Back from '../../components/Back';

const UserManagement = () => {
  const [activeView, setActiveView] = useState('view');
  const [confirmAction, setConfirmAction] = useState(null);
  
  const { handleDeleteUser, isdeletingUser } = DeleteUser();
  const { handleBlockUser, isBlocking } = BlockUser();

  const handleConfirm = async () => {
    const { userId, type } = confirmAction;
    
    try {
      if (type === 'delete') {
        await handleDeleteUser(userId);
      } else if (type === 'block') {
        await handleBlockUser(userId);
      }
      
      if (!isdeletingUser && !isBlocking) {
        setConfirmAction(null);
      }
    } catch (error) {
      console.error(`Error during ${type} action:`, error);
      setConfirmAction(null);
    }
  };

  return (
    <div className="p-8">

    <Back />
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveView('create')}
          className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md ${
            activeView === 'create' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <UserPlus size={18} />
          Create User
        </button>
        <button
          onClick={() => setActiveView('view')}
          className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md ${
            activeView === 'view' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Users size={18} />
          View Users
        </button>
      </div>
      
      {activeView === 'create' ? (
        <Register />
      ) : (
        <UserTable 
          onBlockUser={(userId) => setConfirmAction({ userId, type: 'block' })}
          onDeleteUser={(userId) => setConfirmAction({ userId, type: 'delete' })}
          confirmAction={confirmAction}
          isBlocking={isBlocking}
          isDeletingUser={isdeletingUser}
        />
      )}

        {confirmAction && (
        <>
            <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
            >
                <h2 className="text-lg font-semibold mb-4">
                Confirm {confirmAction.type === 'delete' ? 'Delete' : 'Block'} user?
                </h2>
                <p className="mb-4">
                Are you sure you want to {confirmAction.type} this user? This action 
                {confirmAction.type === 'delete' ? ' cannot' : ' can'} be undone.
                </p>
                <div className="flex justify-end gap-2">
                <button
                    className="px-4 cursor-pointer py-2 bg-gray-300 rounded"
                    onClick={() => setConfirmAction(null)}
                    disabled={confirmAction.type === 'delete' ? isdeletingUser : isBlocking}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded flex items-center gap-2"
                    onClick={handleConfirm}
                    disabled={confirmAction.type === 'delete' ? isdeletingUser : isBlocking}
                >
                    {(confirmAction.type === 'delete' && isdeletingUser) || 
                    (confirmAction.type === 'block' && isBlocking) ? (
                    <>
                        <Loader className="animate-spin h-4 w-4" /> 
                        {confirmAction.type === 'delete' ? "Deleting...": "Blocking..."}
                    </>
                    ) : (
                    'Confirm'
                    )}
                </button>
                </div>
            </motion.div>
            </div>
        </>
        )}
    </div>
  );
};

export default UserManagement;