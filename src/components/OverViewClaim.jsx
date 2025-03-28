import React, { useState, useMemo } from 'react';
import {
    Search,
  } from 'lucide-react';

const OverviewClaimsFilter = ({ RecentClaims, getStatusIcon, getStatusClass, openModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClaims = useMemo(() => {
    return RecentClaims.data?.filter(claim => {

      const matchesSearch = 
        claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.staff?.employee?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claim_reason.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [RecentClaims.data, searchTerm]);

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-gray-800">Recent Claims</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search claims..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border w-full h-[40px] outline-none rounded-md pl-8 pr-2 py-1 text-sm"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>
    
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className='bg-gray-100 text-gray-600 text-left text-sm uppercase tracking-wider'>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_number}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {claim.staff?.employee?.username}
                  </td>
                  <td width={500} className="px-2 py-3 whitespace-nowrap text-sm text-gray-800">{claim.claim_reason}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">&#x20B5;{claim.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(claim.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(claim.status)}
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.payment_date).toLocaleDateString()}
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
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No claims found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewClaimsFilter;