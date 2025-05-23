import { useContext, useMemo, useState } from "react"
import { APIContext } from "../../utils/context/APIContextProvider"
import SelectedClaim from "../../components/SelectedClaim";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Menu } from "lucide-react";
import Back from "../../components/Back";
import PayClaim from "../../api/Pay_Claim";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Pending_claims = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const { pendingClaims, setPendingClaims } = useContext(APIContext);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { isLoading, claim_payment } = PayClaim();
    

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const filteredClaims = useMemo(() => {
      return pendingClaims.data?.filter(claim => {
        const matchesSearch = 
          claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.staff_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim?.claim_reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim?.amount?.toString().includes(searchTerm.toLowerCase());
        
        let matchesMonth = true;
        if (selectedMonth) {
          const claimDate = new Date(claim.created_at);
          matchesMonth = (
            claimDate.getMonth() === selectedMonth.getMonth() && 
            claimDate.getFullYear() === selectedMonth.getFullYear()
          );
        }
  
        return matchesSearch && matchesMonth;
      });
    }, [pendingClaims.data, searchTerm, selectedMonth]);

    const openModal = (claim) => {
      setSelectedClaim(claim);
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toDateString();
    };

    const handlePaymentClick = (claim) => {
        setSelectedClaim(claim);
        setShowModal(true);
    };

    const get_Claim = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/pending_claims/`, {withCredentials: true})

            return setPendingClaims(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    const handleConfirmPayment = async (claim_number) => {
        try {
            await claim_payment(claim_number);
          
            await get_Claim()
        } catch (error) {
          console.error("Payment failed:", error);
        } finally {
          setShowModal(false);
        }
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedMonth(null);
    };
      
    const formatMonthYear = (date) => {
        return date ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All Months';
    };

    return (
        <section className="p-7">
            <Back />
            <div className="bg-gray-900 text-white p-4 mb-5 font-semibold rounded-sm text-lg">
                Pending Claims
            </div>

            <div className="flex w-full items-center justify-between p-6">
                <div className="flex space-x-4">
                    <div className="relative">
                        <DatePicker
                            selected={selectedMonth}
                            onChange={(date) => {setSelectedMonth(date); setIsDatePickerOpen(false)}}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="Filter by month"
                            className="w-[180px] z-15 h-[45px] pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-100 transition"
                            onCalendarOpen={() => setIsDatePickerOpen(true)}
                            onCalendarClose={() => setIsDatePickerOpen(false)}
                        />
                        {selectedMonth && (
                            <button 
                                onClick={() => setSelectedMonth(null)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    {(searchTerm || selectedMonth) && (
                        <button
                            onClick={handleClearFilters}
                            className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        placeholder="Search for pending claims"
                        className="w-[220px] h-[45px] pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-100 transition"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1012 19.5a7.5 7.5 0 004.65-2.85z" />
                    </svg>
                </div>
            </div>

            {selectedMonth && (
                <div className="px-6 pb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Month: {formatMonthYear(selectedMonth)}
                    </span>
                </div>
            )}

            <div className={`relative ${isDatePickerOpen ? 'z-0' : 'z-10'}`}>
                {filteredClaims?.length > 0 ? (
                <>
                    <div className="max-h-[500px] overflow-y-auto border border-gray-300">
                        <table className="min-w-full border-collapse">
                            <thead className={`bg-gray-50 sticky top-0 ${isDatePickerOpen ? 'z-10' : 'z-0'}`}>
                                <tr className="bg-gray-100 text-gray-600 text-left text-sm uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posting Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Reason</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.claim_number} className="bg-white">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{claim.claim_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{claim.staff_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{claim.full_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(claim.created_at)}</td>
                                        <td width={300} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{claim.claim_reason}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            Ghc{Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                claim.status === "paid" ? "bg-green-100 text-green-800" :
                                                claim.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 space-x-1 whitespace-nowrap text-center text-sm text-gray-500">
                                            {claim.status === 'pending' && (
                                                <div>
                                                    <button onClick={() => handlePaymentClick(claim)} className="bg-gray-800 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-700">
                                                        Pay
                                                    </button>
                                                </div>
                                            )}
                                            <button onClick={() => openModal(claim)} className="text-gray-600 font-bold cursor-pointer hover:text-gray-800"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <AnimatePresence>
                        {isOpen && selectedClaim && (
                            <SelectedClaim 
                                selectedClaim={selectedClaim} 
                                formatDate={formatDate} 
                                setSelectedClaim={setSelectedClaim} 
                                closeModal={closeModal} 
                            />
                        )}
                    </AnimatePresence>

                    {showModal && selectedClaim && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                            />
                            <motion.div
                                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-96"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h3 className="text-lg font-medium">
                                    Are you sure you want to make this payment?
                                </h3>
                                <div className="mt-4 flex justify-end gap-4">
                                    <button  onClick={() => handleConfirmPayment(selectedClaim.claim_number)} className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-green-600">
                                        {isLoading ? (<div className="flex items-center gap-1"><Loader className="animate-spin" /> <span>a moment</span></div>) : "Yes, Pay"}
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-red-600">
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-gray-500">No pending claims found matching your filters.</p>
                    {(searchTerm || selectedMonth) && (
                        <button
                            onClick={handleClearFilters}
                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
            </div>
            
        </section>
    );
};

export default Pending_claims;