import { useCallback, useContext, useState } from "react";
import { APIContext } from "../utils/context/APIContextProvider";
import UserTableSkeleton from "./UserTableSkeleton";
import { Loader, Trash2, Lock, Unlock , PenIcon, RefreshCcw, Search } from 'lucide-react';
import UnBlockUser from "../api/Un_blockUser";

const UserTable = ({ onBlockUser, onDeleteUser, confirmAction, isBlocking, isDeletingUser }) => {
  const { user, allUsers, isGettingUsers, setAllUsers } = useContext(APIContext);
  const { handleUnBlockUser, isUnBlocking } = UnBlockUser()

  const [searchQuery, setSearchQuery] = useState("");

  const unblockuser = useCallback( async (userId) => {
      try {
        const response = await handleUnBlockUser(userId)

        if(response){
            console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
    },
    [handleUnBlockUser],
  )

  const handleBlockUser = async (userId) => {
    await onBlockUser(userId);
  };

  const handleDeleteUser = async (userId) => {
    try {
       const response = await onDeleteUser(userId); 
       if(response){
        setAllUsers((prev) => prev.filter((u) => u.staff_id !== userId));
       }
    } catch (error) {
        console.log(error)
    }
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [isLoading, setIsLoading] = useState(false);
  const refreshUsers = useCallback( async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/users/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if(response.ok){
            const data = await response.json();
            setAllUsers(data.data);
        } else {
            const errData = await response.json();
            console.log(errData);
        }
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }, [BASE_URL, setAllUsers]);

  // Filter users based on search query
  const filteredUsers = allUsers?.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.employee?.username?.toLowerCase().includes(query) ||
      u.employee?.email?.toLowerCase().includes(query) ||
      u.phone_number?.toLowerCase().includes(query) ||
      u.staff_id?.toLowerCase().includes(query) ||
      u.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-gray-700">User List</h2>
            {isGettingUsers && (
            <div className="flex items-center text-gray-500 text-sm ml-4">
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Loading users...
            </div>
            )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg pl-10 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-gray-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
          </div>

          <div className="relative group">
            <button onClick={refreshUsers} title="Refresh users" className="p-3 bg-gray-200 cursor-pointer rounded-full hover:bg-gray-300">
                {isLoading ? (<RefreshCcw className="w-6 h-6 animate-spin text-gray-700" />) : (<RefreshCcw className="w-6 h-6 text-gray-700" />)}
            </button>
            
            <span className="absolute -top-10 left-8 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Refresh Users
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm uppercase tracking-wider">
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Staff ID</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {isGettingUsers ? (
            <UserTableSkeleton />
          ) : (
            <tbody>
              {filteredUsers?.filter((u) => u.role !== "main_administrator" || user.data.role !== "administrator")
                .map((user) => (
                  <tr key={user.staff_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{user.employee.username}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{user.employee.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{user.phone_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{user.staff_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600 capitalize">{user.role}</td>
                    <td className="p-4 flex gap-2 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                    
                        {user.is_blocked ? (
                          <button onClick={() => unblockuser(user.staff_id)} className="p-2 cursor-pointer flex items-center gap-2 transition-all text-red-500">
                            <div className="flex items-center gap-1">
                                {isUnBlocking ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <>
                                        <Unlock className="h-4 w-4" /> 
                                        <span>UnBlocked</span>
                                    </>
                                )}
                            </div>
                          </button>
                        ) : (
                          <div>
                            {isBlocking && confirmAction?.userId === user.staff_id && confirmAction?.type === 'block' ? 
                              <Loader className="animate-spin h-4 w-4" /> : 
                              <button onClick={() => handleBlockUser(user.staff_id)} className="p-2 cursor-pointer flex items-center gap-2 transition-all text-red-500 hover:text-red-600">
                                <div className="flex items-center gap-1">
                                    <Lock className="h-4 w-4" /> 
                                    <span>Block</span>
                                </div>
                              </button>
                            }
                          </div>
                        )}

                        <button
                            onClick={() => handleDeleteUser(user.staff_id)}
                            className={`p-2 cursor-pointer flex items-center gap-2 transition-all text-red-500 hover:text-red-600`}
                            disabled={isDeletingUser}
                        >
                            {isDeletingUser && confirmAction?.userId === user.staff_id && confirmAction?.type === 'delete' ? 
                            <Loader className="animate-spin h-4 w-4" /> : 
                            <Trash2 className="h-4 w-4" />} Delete
                        </button>

                        <button className="p-2 cursor-pointer flex items-center gap-2 transition-all text-green-500 hover:text-green-600">
                            <div className="flex items-center gap-1">
                                <PenIcon className="h-4 w-4" /> 
                                <span>Edit</span>
                            </div>
                        </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default UserTable;
