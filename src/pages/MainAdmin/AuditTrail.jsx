import React, { useState, useMemo, useContext } from 'react';
import { APIContext } from '../../utils/context/APIContextProvider';
import Back from '../../components/Back';
import {motion, AnimatePresence } from 'framer-motion'
import AuditView from '../../components/AuditView';

const AuditTable = () => {
  const { auditTrails } = useContext(APIContext);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

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
            <span className="text-red-600 line-through">{value.old ? (
              value.old === true || false ? (
                value.old === false ? "False" : "True"
              ) : value.old
            ) : null}</span> 
            <span className="mx-1">→</span>
            <span className="text-green-600">{value.new ? (
              value.new === true || false ? (
                value.new === false ? "False" : "True"
              ) : value.new
            ) : null}</span>
          </span>
        ) : (
          <span className="text-gray-600">{value.toString() ? value.toString() : null}</span>
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
        const userName = `${audit.user.first_name} ${audit.user.last_name}`.toLowerCase();
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
            aValue = `${a.user.first_name} ${a.user.last_name}`;
            bValue = `${b.user.first_name} ${b.user.last_name}`;
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

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <th>View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {audit.user.first_name[0]}{audit.user.last_name[0]}
                          </div>
                        </div> */}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {audit.user.first_name} {audit.user.last_name}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {Array.isArray(auditTrails) ? 'No results found' : 'Loading audit trails...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

        <AnimatePresence>
          {isOpen && selectedClaim && (
            <AuditView closeModal={closeModal} selectedClaim={selectedClaim} formatDate={formatDate} renderChanges={renderChanges} />
          )}
        </AnimatePresence>
      
    </div>
  );
};

export default AuditTable;