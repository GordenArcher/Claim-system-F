import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Clock, CheckCheck, } from 'lucide-react';

const ClaimsTable = ({ claimsHistory, openModal }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'paid':
        return <CheckCheck className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const filteredAndSearchedClaims = useMemo(() => {
    let result = claimsHistory?.data || [];

    if (filter !== 'all') {
      result = result.filter(claim => claim.status === filter);
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(claim => 
        claim.claim_number.toLowerCase().includes(searchTermLower) ||
        claim.staff_number.toLowerCase().includes(searchTermLower) ||
        claim.full_name.toLowerCase().includes(searchTermLower) ||
        claim.claim_reason.toLowerCase().includes(searchTermLower)
      );
    }

    return result;
  }, [claimsHistory?.data, filter, searchTerm]);

  const paginatedClaims = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSearchedClaims.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSearchedClaims, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((filteredAndSearchedClaims.length || 0) / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Claims History</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search claims..."
              className="border border-gray-300 outline-none rounded-md p-2 pl-8 w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-2 top-3 text-gray-400" size={16} />
          </div>

          <select
            className="border border-gray-300 rounded-md p-2"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Claims</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posting Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Reason</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedClaims?.length > 0 ? (
              paginatedClaims.map((claim, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_number}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.staff_number}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {claim?.full_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.payment_date).toLocaleDateString()}
                  </td>
                  <td width={300} className="px-2 py-3 whitespace-nowrap text-sm text-gray-800">{claim.claim_reason}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">&#x20B5;{claim.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(claim.status)}
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex gap-1">
                      <button onClick={() => openModal(claim)} className="text-gray-600 cursor-pointer hover:text-gray-800">View</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No claims available for the selected filter or search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className='flex flex-col gap-2'>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 text-gray-800 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}
                >
                    <ChevronLeft size={16} className="mr-1" />
                </button>
                <button onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className={`p-2 text-gray-800 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}>
                    <ChevronRight size={16} className="ml-1" />
                </button>

                <span className="text-gray-700 font-bold">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            <div className="text-sm text-gray-600">
                {Math.min(currentPage * itemsPerPage, filteredAndSearchedClaims.length)} of{' '}
                {filteredAndSearchedClaims.length} entries
            </div>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ClaimsTable;