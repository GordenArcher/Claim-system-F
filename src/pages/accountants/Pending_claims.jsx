import { useContext, useState } from "react"
import { APIContext } from "../../utils/context/APIContextProvider"
import SelectedClaim from "../../components/SelectedClaim";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Menu } from "lucide-react";
import Back from "../../components/Back";
import Pay_Claim from "../../api/Pay_Claim";

const Pending_claims = () => {

    const { pendingClaims, setPendingClaims } = useContext(APIContext);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { isLoading, claim_payment } = Pay_Claim();

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

    const handleConfirmPayment = async (claim_number, phone_number) => {
        try {
            await claim_payment(claim_number, phone_number);

            setPendingClaims((prevClaims) => ({
                ...prevClaims,
                data: prevClaims.data.filter(claim => claim.claim_number !== claim_number)
            }));

            setShowModal(false);
        } catch (error) {
            console.error("Payment failed:", error);
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
                                <tr>
                                    <th className="px-4 py-2 border">Claim Number</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Amount</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Action</th>
                                    <th className="px-4 py-2 border">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingClaims.data.map((claim) => (
                                    <tr key={claim.claim_number} className="bg-white border-b">
                                        <td className="px-4 text-center py-2 border">{claim.claim_number}</td>
                                        <td className="px-4 text-center py-2 border">
                                            {claim.staff.employee.first_name} {claim.staff.employee.last_name}
                                        </td>
                                        <td className="px-4 text-center py-2 border">
                                            Ghc{Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 text-center py-2 border">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                claim.status === "paid" ? "bg-green-100 text-green-800" :
                                                claim.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-4 text-center py-2">
                                            <button 
                                                onClick={() => handlePaymentClick(claim)} 
                                                className="bg-gray-800 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-700"
                                            >
                                                Pay
                                            </button>
                                        </td>
                                        <td className="px-4 flex items-center justify-center text-center py-2 border">
                                            <button
                                                onClick={() => openModal(claim)}
                                                className="bg-gray-900 text-white p-3.5 cursor-pointer rounded-full hover:bg-gray-700"
                                            >
                                                <Menu size={20} />
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
                                        onClick={() => handleConfirmPayment(selectedClaim.claim_number, selectedClaim.staff.phone_number)} 
                                        className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        {isLoading ? <Loader /> : "Yes, Pay"}
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
