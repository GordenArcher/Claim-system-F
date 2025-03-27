import { useContext, useState } from "react"
import { APIContext } from "../../utils/context/APIContextProvider"
import SelectedClaim from "../../components/SelectedClaim";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Menu } from "lucide-react";
import Back from "../../components/Back";
import PayClaim from "../../api/Pay_Claim";
import axios from "axios";

const Pending_claims = () => {

    const { pendingClaims, setPendingClaims } = useContext(APIContext);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { isLoading, claim_payment } = PayClaim();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const openModal = (claim) => {
      setSelectedClaim(claim);
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
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
      

    return (
        <section className="p-7">
            <Back />
            <div className="bg-gray-900 text-white p-4 mb-5 font-semibold rounded-sm text-lg">
                Pending Claims
            </div>

            {pendingClaims?.data?.length > 0 ? (
                <>
                    <div className="max-h-[500px] overflow-y-auto border border-gray-300">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr className="bg-gray-100 text-gray-600 text-left text-sm uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingClaims.data.map((claim) => (
                                    <tr key={claim.claim_number} className="bg-white">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{claim.claim_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {claim.staff.employee.username}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            Ghc{Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td width={500} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {claim.claim_reason}
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
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            <button onClick={() => handlePaymentClick(claim)} className="bg-gray-800 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-700">
                                                Pay
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            <button onClick={() => openModal(claim)} className="text-gray-600 cursor-pointer hover:text-gray-800"
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
                                    <button 
                                        onClick={() => handleConfirmPayment(selectedClaim.claim_number)} 
                                        className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        {isLoading ? <Loader className="animate-spin" /> : "Yes, Pay"}
                                    </button>
                                    <button 
                                        onClick={() => setShowModal(false)} 
                                        className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </>
            ) : (
                <p className="p-4 text-gray-500">No pending claims available.</p>
            )}
        </section>
    );
};

export default Pending_claims;
