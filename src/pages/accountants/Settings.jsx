import { useState, useEffect, useContext } from "react";
import Back from "../../components/Back";
import { Loader, User, Lock, Shield, Save, Copy, Bell } from 'lucide-react';
import { toast } from "react-toastify";
import { APIContext } from "../../utils/context/APIContextProvider";
import ChangeProfile from "../../api/ChangeProfile";
import ChangePassword from "../../api/ChangePassword";
import axios from "axios";

const Settings = () => {
  const { user, setUser } = useContext(APIContext);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  
  const [activeTab, setActiveTab] = useState("profile");
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.data.username || "",
        email: user.data.email || "",
        phoneNumber: user.data.phone_number || ""
      });
    }

  }, [user]);

  const {isSettingProfile, change_profile} = ChangeProfile()

  const getU = async () => {
    const response = await axios.get(`${BASE_URL}/profile/get_user/`, {withCredentials: true});
    return setUser(response.data)
  }

  const profileChange = async (profileData) => {
    try {
        await change_profile(profileData)
        await getU()
    } catch (error) {
        console.log(error)
    }

  }
  

  const { isChangingPassword, change_password } = ChangePassword()

  const copy_staffID = () => {
    navigator.clipboard.writeText(user.data.staff_id);
    toast.success("Staff ID Copied!")
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Back />
      
        <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                
                <div className="space-y-2">
                    <button onClick={() => setActiveTab("profile")} className={`flex cursor-pointer items-center gap-2 w-full px-4 py-2 rounded-md text-left ${activeTab === "profile" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                        <User size={18} />
                        <span>Profile</span>
                    </button>
                    
                    <button onClick={() => setActiveTab("security")} className={`flex cursor-pointer items-center gap-2 w-full px-4 py-2 rounded-md text-left ${activeTab === "security" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                        <Lock size={18} />
                        <span>Security</span>
                    </button>
                    
                </div>
            </div>
            
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                {activeTab === "profile" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={(e) => setProfileData((prevData) => ({...prevData, username: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
                                    <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData((prevData) => ({...prevData, email: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                    type="tel"
                                    name="phone_number"
                                    value={profileData.phoneNumber}
                                    onChange={(e) => setProfileData((prevData) => ({...prevData, phoneNumber: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <input
                                        type="text"
                                        disabled
                                        value={user.data.staff_id}
                                        className="w-full px-3 py-2 focus:outline-none"
                                        />
                                        <button type="button" onClick={copy_staffID} className="p-3 cursor-pointer hover:bg-gray-300 rounded-xl">
                                            <Copy className="w-5 h-5 text-gray-800" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button onClick={() => profileChange(profileData)} type="button" disabled={isSettingProfile} className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none">
                                    {isSettingProfile ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                    ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Save Changes</span>
                                    </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === "security" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            change_password(passwordData)
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData((prevState) => ({...prevState, currentPassword: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData((prevState) => ({...prevState, newPassword: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData((prevState) => ({...prevState, confirmPassword: e.target.value}))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button type="submit" disabled={isChangingPassword} className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none">
                                    {isChangingPassword ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                    ) : (
                                    <>
                                        <Shield size={16} />
                                        <span>Update Password</span>
                                    </>
                                    )}
                                </button>
                            </div>
                        </form>
                        
                    </div>
                )}
                
            </div>
        </div>
    </div>


)}


          

export default Settings