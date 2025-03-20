import React, { useState } from 'react';
import { Search, Loader, X } from 'lucide-react';
import Verify_Claim from '../../api/Verify_claim';
import Back from '../../components/Back';
import { Menu } from "lucide-react";
import SelectedClaim from '../../components/SelectedClaim';
import PayClaim from '../../api/Pay_Claim';

const ClaimSearchAndDisplay = () => {
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.detail) return error.detail;
    if (error?.message) return error.message;
    return 'An error occurred while retrieving claim information';
  };

  const { isLoading, claim_payment } = PayClaim();

  return (
    <div className="w-full mt-6 max-w-6xl mx-auto p-4">
      <Back />
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full h-[55px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:border-black transition duration-300"
              placeholder="Search by claim number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={() => get_Claim(searchQuery)}
            className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
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
            
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">{staff_claim.data.claim_number}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {staff_claim.data.staff.employee.first_name} {staff_claim.data.staff.employee.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${Number(staff_claim.data.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff_claim.data.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : staff_claim.data.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {staff_claim.data.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {staff_claim.data.status === "pending" ? (
                    <div>
                      <button 
                            onClick={() => claim_payment(staff_claim.data.claim_number)} 
                            className="bg-gray-800 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                          {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : "Pay"}
                            
                        </button>
                    </div>
                  ) : "Already Paid"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openModal(staff_claim.data)}
                    className="bg-gray-900 text-white p-3.5 cursor-pointer rounded-full hover:bg-gray-700"
                  >
                    <Menu size={20} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : staff_claim ? (
        <div className="text-center py-8 text-gray-600">No claim details available</div>
      ) : (
        <div className="text-center py-8 text-gray-600">Search for a claim by Claim number</div>
      )}

      {/* Modal */}
      {isOpen && selectedClaim && (
        <SelectedClaim selectedClaim={selectedClaim} closeModal={closeModal} formatDate={formatDate} />
      )}
    </div>
  );
};

export default ClaimSearchAndDisplay;