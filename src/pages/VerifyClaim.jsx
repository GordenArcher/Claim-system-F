import React, { useState } from 'react';
import { Search, Loader, X } from 'lucide-react';
import SelectedClaim from '../components/SelectedClaim';
import Verify_Claim from '../api/Verify_claim';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyClaim = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const [searchQuery, setSearchQuery] = useState('');
  const { staff_claim, loading, error, get_Claim, clearClaim } = Verify_Claim();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (claim) => {
    setSelectedClaim(claim);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleClearClaim = () => {
    clearClaim();
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
};

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.detail) return error.detail;
    if (error?.message) return error.message;
    return 'An error occurred while retrieving claim information';
  };

  const [showPhoneModel, setShowPhoneModel] = useState(false)
  const [formatData, setFormData] = useState({
    staffNumber: "",
    phoneNumber: ""
  })
  const [loadingPhoneSave, setLoadingPhoneSave] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");


  const handleSavePhone = async (e) => {
    e.preventDefault();
  
    if (!formatData.phoneNumber || !formatData.staffNumber) {
        toast.error("Please fill in both fields.");
      return;
    }
  
    const cleaned = formatData.phoneNumber.replace(/[\s-]/g, '');
    const pattern = /^(?:\+233|233|0)(24|25|26|27|28|50|51|52|53|54|55|56|57|58|59)\d{7}$/;
  
    if (!pattern.test(cleaned)) {
        setResponseMessage("Please enter a valid Ghanaian phone number.");
      return;
    }
  
    try {
        setLoadingPhoneSave(true);
  
      const response = await axios.post(`${BASE_URL}/staff/save_phone/`, {
        staff_number: formatData.staffNumber,
        phone_number: formatData.phoneNumber,
      });
  
      toast.success(response.data.message || "Claim verification successful.");
      setFormData({
        staffNumber: "",
        phoneNumber:""
      })
    } catch (error) {
        toast.error(
        error.response?.data?.message || "Claim verification failed. Please try again."
      );
    } finally {
        setLoadingPhoneSave(false);
    }
  };

    let TotalAmount = 0;

    if(Array.isArray(staff_claim?.data)) {
        TotalAmount = staff_claim?.data.reduce((sum, claim) => sum + Number(claim?.amount), 0);
    }
  

  return (
    <div className="w-full mt-6 max-sm:p-2 mx-auto p-4">
      <div className="mb-6">
        <div className='flex p-2 mb-5 flex-col gap-1'>
        <span>Please ignore if you have added your phone number already</span>
            <span onClick={() => setShowPhoneModel(true)} className='text-blue-600 cursor-pointer font-bold hover:underline'>Add phone</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>

            <input type="text" className="block w-full h-[55px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:border-black transition duration-300" placeholder="Search by request number or staff number" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
          
          <button type="submit" onClick={() => get_Claim(searchQuery)} className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none" disabled={loading}>
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Searching... Please wait</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {getErrorMessage(error)}
        </div>
      )}

      {staff_claim && staff_claim.data ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex justify-end p-2">
            <button 
              onClick={handleClearClaim}
              className="flex items-center cursor-pointer gap-1 text-gray-500 hover:text-red-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-100"
            >
              <X size={16} /> Clear Result
            </button>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto border border-gray-300">
                <table className="min-w-full divide-y overflow-x-scroll divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posting Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y overflow-x-scroll divide-gray-200">
                {Array.isArray(staff_claim.data) ? (
                    staff_claim.data.map((claim, index) => (
                        <>
                        <tr key={index} className='overflow-x-scroll'>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_number}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.staff_number}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.full_name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{formatDate(claim.created_at)}</td>
                            <td width={300} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_reason}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                            Ghc{Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                claim.status === "paid" ? "bg-green-100 text-green-800" :
                                claim.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                            }`}>
                                {claim.status}
                            </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                            <button
                                onClick={() => openModal(claim)}
                                className="text-gray-600 cursor-pointer hover:text-gray-800 ml-2"
                            >
                                View
                            </button>
                            </td>
                        </tr>
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan={5}></td>
                            <td colSpan={2}></td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-800">
                                Total: Ghc{TotalAmount.toLocaleString("en-US", {currency:"GHC" , minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </>
                    ))
                ) : (
                    <tr className='overflow-x-scroll'>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{staff_claim.data.claim_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{staff_claim.data.staff_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{staff_claim.data.full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{formatDate(staff_claim.data.created_at)}</td>
                    <td width={300} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{staff_claim.data.claim_reason}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                        Ghc{Number(staff_claim.data.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        staff_claim.data.status === "paid" ? "bg-green-100 text-green-800" :
                        staff_claim.data.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                        }`}>
                        {staff_claim.data.status}
                        </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                        <button
                        onClick={() => openModal(staff_claim.data)}
                        className="text-gray-600 cursor-pointer hover:text-gray-800 ml-2"
                        >
                        View
                        </button>
                    </td>
                    </tr>
                )}
                </tbody>

            </table>
          </div>
          
        </div>
      ) : staff_claim ? (
        <div className="text-center py-8 text-gray-600">No claim details found</div>
      ) : (
            (!loading &&<div className="text-center py-8 text-gray-600">search for a claim using either the request number or staff number to retrieve all claims associated with that staff.</div>)
      )}

      {isOpen && selectedClaim && (
        <SelectedClaim selectedClaim={selectedClaim} closeModal={closeModal} formatDate={formatDate} />
      )}

        <AnimatePresence>
            {showPhoneModel && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 w-full h-full bg-slate-600 bg-opacity-50 flex items-center justify-center z-50"
            >
                <div className="bg-white p-6 rounded shadow-md w-[300px]">
                    {responseMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {responseMessage}
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Enter Your Staff Number</h2>
                        <input
                            type="text"
                            value={formatData.staffNumber}
                            onChange={(e) => setFormData((currentValue) => ({...currentValue, staffNumber: e.target.value}))}
                            className="w-full border border-gray-300 outline-none rounded px-3 py-2 mb-4"
                            placeholder="Staff Number"
                        />
                    </div>


                    <div>
                        <h2 className="text-lg font-semibold mb-4">Enter Your Phone Number</h2>
                        <input
                            type="text"
                            value={formatData.phoneNumber}
                            onChange={(e) => setFormData((currentValue) => ({...currentValue, phoneNumber: e.target.value}))}
                            className="w-full border border-gray-300 outline-none rounded px-3 py-2 mb-4"
                            placeholder="Phone Number"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-3 py-1 rounded bg-red-500 cursor-pointer text-white"
                            onClick={() => setShowPhoneModel(false)}
                        >
                        Cancel
                        </button>

                        <button 
                            onClick={handleSavePhone}
                            className="px-3 py-1 rounded bg-slate-700 cursor-pointer hover:bg-slate-800 text-white"
                        >
                            {loadingPhoneSave ? (
                                <div>
                                    <Loader size={12} className='animate-spin' />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                <span className='text-base'>Submit</span>
                            )}
                            
                        </button>
                    </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
    </div>

    
  );
};

export default VerifyClaim;