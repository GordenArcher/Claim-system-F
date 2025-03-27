import { useContext, useState } from "react"
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { APIContext } from "../../utils/context/APIContextProvider";
import SelectedClaim from "../../components/SelectedClaim";
import EmptyImage from '../../assets/images/empty.svg'
import Back from "../../components/Back";


const PaymentHistory = () => {

    const { payHistory } = useContext(APIContext)

    const [selectedClaim, setSelectedClaim] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

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

  return (
    <section className="p-7">
    <div className="pb-3">
        <Back />

        <div className="bg-gray-900 rounded-sm text-white p-4 mb-5 font-semibold text-lg">
            Payments History
        </div>
    </div>

    {payHistory?.history?.length > 0 ? (
    <>
        <div className="max-h-[500px] overflow-y-auto border border-gray-300">
            <table className="min-w-full divide-y border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {payHistory.history.map((claim) => (
                    <tr key={claim.claim_number} className="bg-white">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                        {claim.staff.employee.username}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                        Ghc{Number(claim.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td width={500} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">
                        {claim.claim_reason}
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

            <div>
                <p className="font-extrabold text-gray-900">No Payments has been made</p>
            </div>
        </div>
    </div>
  )}
</section>
  )
}

export default PaymentHistory
