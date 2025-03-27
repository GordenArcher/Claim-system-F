import React, { useState, useMemo, useContext } from 'react';
import { APIContext } from '../../utils/context/APIContextProvider';
import Back from '../../components/Back';
import { motion, AnimatePresence } from 'framer-motion'
import AuditView from '../../components/AuditView';
import { ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

const AuditTable = () => {
  const { auditTrails } = useContext(APIContext);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const renderChanges = (changes) => {
    return Object.entries(changes).map(([key, value]) => (
      <div key={key} className="text-sm py-1">
        <span className="font-medium text-gray-700">{key}: </span>
        {typeof value === 'object' ? (
          <span>
            {value.old !== undefined && (
              <span className="text-red-600 line-through">
                {typeof value.old === 'boolean' ? (value.old ? "True" : "False") : value.old?.toString()}
              </span>
            )}
            <span className="mx-1">→</span>
            {value.new !== undefined && (
              <span className="text-green-600">
                {typeof value.new === 'boolean' ? (value.new ? "True" : "False") : value.new?.toString()}
              </span>
            )}
          </span>
        ) : (
          <span className="text-gray-600">{String(value)}</span>
        )}
      </div>
    ));
  };

  const filteredAndSortedData = useMemo(() => {
    const dataArray = Array.isArray(auditTrails) ? auditTrails : [];
    let filteredData = [...dataArray];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(audit => {
        const userName = `${audit.user.username}`.toLowerCase();
        const email = audit.user.email.toLowerCase();
        const entity = `${audit.entity_type} ${audit.entity_id}`.toLowerCase();
        const action = audit.action.toLowerCase();
        const timestamp = formatDate(audit.timestamp).toLowerCase();
        const changesStr = JSON.stringify(audit.changes).toLowerCase();

        return (
          userName.includes(searchLower) ||
          email.includes(searchLower) ||
          entity.includes(searchLower) ||
          action.includes(searchLower) ||
          timestamp.includes(searchLower) ||
          changesStr.includes(searchLower)
        );
      });
    }

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'user':
            aValue = `${a.user.username}`;
            bValue = `${b.user.username}`;
            break;
          case 'action':
            aValue = a.action;
            bValue = b.action;
            break;
          case 'entity':
            aValue = `${a.entity_type} ${a.entity_id}`;
            bValue = `${b.entity_type} ${b.entity_id}`;
            break;
          case 'timestamp':
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
    }

    return filteredData;
  }, [auditTrails, sortConfig, searchTerm]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 3a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L10 5.414 6.707 8.707a1 1 0 01-1.414-1.414l4-4A1 1 0 0110 3z" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 17a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 14.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 17z" />
      </svg>
    );
  };

  const renderPaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50">
        <div className="flex flex-col space-x-2">

        <div className="flex items-center space-x-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`p-2 text-gray-800 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={`p-2 text-gray-800 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}
              >
              <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-gray-700 font-bold">
                Page {currentPage} of {totalPages}
              </span>
          </div>

          <span className="text-sm text-gray-700">
            Showing {' '}
            <span className="font-medium">{Math.min(endIndex, filteredAndSortedData.length)}</span>
            {' '} of {' '}
            <span className="font-medium">{filteredAndSortedData.length}</span>
            {' '} results
          </span>

          
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
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Back />

      <div className="bg-gray-900 text-white p-4 rounded-lg font-semibold text-lg mb-5">
        <h1 className="text-2xl font-bold text-white">Audit Trail</h1>
        <p className="text-sm text-gray-500">Recent changes and updates</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center"> 
            <div className="relative">
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-x-auto max-h-[600px]">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">
                  <button onClick={() => handleSort('user')} className="flex items-center gap-2 hover:text-blue-600">
                    User
                    {getSortIcon('user')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button onClick={() => handleSort('action')} className="flex items-center gap-2 hover:text-blue-600">
                    Action
                    {getSortIcon('action')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button onClick={() => handleSort('entity')} className="flex items-center gap-2 hover:text-blue-600">
                    Entity
                    {getSortIcon('entity')}
                  </button>
                </th>
                <th className="px-6 py-4">Changes</th>
                <th className="px-6 py-4">
                  <button onClick={() => handleSort('timestamp')} className="flex items-center gap-2 hover:text-blue-600">
                    Timestamp
                    {getSortIcon('timestamp')}
                  </button>
                </th>
                <th className='px-6 py-4'>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.length > 0 ? (
                paginatedData.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {audit.user.username[0]}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-extrabold text-gray-900">
                            {audit.user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {audit.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        audit.action === 'create' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {audit.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {audit.entity_type} #{audit.entity_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderChanges(audit.changes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(audit.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button onClick={() => openModal(audit)} className='text-center cursor-pointer'>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {Array.isArray(auditTrails) ? 'No results found' : 'Loading audit trails...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {renderPaginationControls()}
      </div>

      <AnimatePresence>
        {isOpen && selectedClaim && (
          <AuditView 
            closeModal={closeModal} 
            selectedClaim={selectedClaim} 
            formatDate={formatDate} 
            renderChanges={renderChanges} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditTable;