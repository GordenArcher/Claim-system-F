import { useState, useEffect, useContext } from "react";
import Back from "../../components/Back";
import { Loader, User, Lock, Shield, Save, Copy } from 'lucide-react';
import { toast } from "react-toastify";
import { APIContext } from "../../utils/context/APIContextProvider";
import ChangeProfile from "../../api/ChangeProfile";
import LogoutButton from "../../components/LogoutButton";
import ChangePassword from "../../api/ChangePassword";

const Settings = () => {
  const { user } = useContext(APIContext);
  
  const [activeTab, setActiveTab] = useState("profile");
//   const [notifications, setNotifications] = useState(true);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.data.first_name || "",
        lastName: user.data.last_name || "",
        email: user.data.email || "",
        phoneNumber: user.data.phone_number || ""
      });
    }

  }, [user]);

  const {isSettingProfile, change_profile} = ChangeProfile()
  
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const { isChangingPassword, change_password } = ChangePassword()


//   const toggleNotifications = () => {
//     setNotifications(!notifications);
//   };

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
                    
                    {/* <button onClick={() => setActiveTab("notifications")} className={`flex cursor-pointer items-center gap-2 w-full px-4 py-2 rounded-md text-left ${activeTab === "notifications" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                        <Bell size={18} />
                        <span>Notifications</span>
                    </button> */}
                    
                </div>
            
                <div className="mt-8">
                    <LogoutButton />
                </div>
            </div>
            
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                {activeTab === "profile" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                    type="text"
                                    name="first_name"
                                    value={profileData.firstName}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                    type="text"
                                    name="last_name"
                                    value={profileData.lastName}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
                                    <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                    type="tel"
                                    name="phone_number"
                                    value={profileData.phoneNumber}
                                    onChange={handleProfileChange}
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
                                        onChange={handleProfileChange}
                                        className="w-full px-3 py-2 focus:outline-none"
                                        />
                                        <button type="button" onClick={copy_staffID} className="p-3 cursor-pointer hover:bg-gray-300 rounded-xl">
                                            <Copy className="w-5 h-5 text-gray-800" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button onClick={() => change_profile(profileData)} type="button" disabled={isSettingProfile} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none">
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
                                    onChange={handlePasswordChange}
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
                                    onChange={handlePasswordChange}
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
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button type="submit" disabled={isChangingPassword} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none">
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
                        
                        {/* <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium mb-3">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Add an extra layer of security to your account by enabling two-factor authentication.
                            </p>
                            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                Enable 2FA
                            </button>
                        </div> */}
                    </div>
                )}
                
                {/* {activeTab === "notifications" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Push Notifications</h3>
                                    <p className="text-sm text-gray-500">
                                        Receive alerts even when you're not using the app
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={toggleNotifications}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">
                                        Receive updates and alerts via email
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={toggleNotifications}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    </div>


)}


          

export default Settings