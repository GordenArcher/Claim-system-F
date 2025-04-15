import { useContext, useMemo, useState } from "react"
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { APIContext } from "../../utils/context/APIContextProvider";
import SelectedClaim from "../../components/SelectedClaim";
import EmptyImage from '../../assets/images/empty.svg'
import Back from "../../components/Back";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PaymentHistory = () => {
    const { payHistory } = useContext(APIContext)
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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

    const formatMonthYear = (date) => {
        return date ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All Months';
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedMonth(null);
    };

    const filteredClaims = useMemo(() => {
        return payHistory.history?.filter(claim => {
            // Text search filter
            const matchesSearch = 
                claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.staff_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim?.claim_reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim?.amount?.toString().includes(searchTerm.toLowerCase());
            
            // Month filter
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
    }, [payHistory.history, searchTerm, selectedMonth]);

    return (
        <section className="p-7">
            <div className="pb-3">
                <Back />

                <div className="bg-gray-900 rounded-sm text-white p-4 mb-5 font-semibold text-lg">
                    Payment History
                </div>
            </div>

            <div className="flex w-full items-center justify-between p-6">
                <div className="flex space-x-4">
                    <div className="relative">
                        <DatePicker
                            selected={selectedMonth}
                            onChange={(date) => {setSelectedMonth(date); setIsDatePickerOpen(false)}}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            se
                            placeholderText="Filter by month"
                            className="w-[180px] h-[45px] pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-100 transition"
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
                        placeholder="Search for claims"
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
                        <table className="min-w-full divide-y border-collapse">
                            <thead className={` bg-gray-50 sticky top-0 ${isDatePickerOpen ? 'z-10' : 'z-0'}`}>
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
                            <tbody className="divide-y divide-gray-200">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.claim_number} className="bg-white">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.staff_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                                            {claim.full_name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{formatDate(claim.created_at)}</td>
                                        <td width={300} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                                            {claim.claim_reason}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                                            Ghc{Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                claim.status === "paid" ? "bg-green-100 p-2 text-green-800" :
                                                claim.status === "pending" ? "bg-yellow-100 p-2 text-yellow-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                                            <button
                                                onClick={() => openModal(claim)}
                                                className="text-gray-600 cursor-pointer hover:text-gray-800"
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
                            <SelectedClaim selectedClaim={selectedClaim} formatDate={formatDate} setSelectedClaim={setSelectedClaim} closeModal={closeModal} />
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <div className="p-4 w-full h-full">
                    <div className="flex items-center justify-between flex-col gap-4">
                        <div className="relative p-2">
                            <img className="w-[40%] m-auto" src={EmptyImage} alt="empty image" />
                        </div>

                        <div className="text-center">
                            {(searchTerm || selectedMonth) ? (
                                <>
                                    <p className="font-extrabold text-gray-900">No payments match your filters</p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Clear Filters
                                    </button>
                                </>
                            ) : (
                                <p className="font-extrabold text-gray-900">No payments have been made</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </div>
            
        </section>
    )
}

export default PaymentHistory