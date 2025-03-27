import React, { useContext, useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  PieChart,
  BarChart,
  CheckCheck,
  User,
  Loader
} from 'lucide-react';
import Back from '../../components/Back';
import { APIContext } from '../../utils/context/APIContextProvider';
import ClaimsReportsTab from './Reports';
import SelectedClaim from '../../components/SelectedClaim';
import { AnimatePresence } from 'framer-motion';
import ProcessingTime from './ProcessingTime';
import Get_staff_processes from '../../api/Get_staff_processes';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterOpen, setFilterOpen] = useState(false);
  const { claimsHistory, RecentClaims, reportSummery  } = useContext(APIContext)

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'paid':
        return <CheckCheck className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100';
    }
  };

  const [filter, setFilter] = useState('all');

  const filteredClaims = filter === 'all' 
    ? claimsHistory?.data 
    : claimsHistory?.data.filter(claim => claim.status === filter);

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

    const { loadingProcessors, topProcessors } = Get_staff_processes()

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
        <Back />
      <div className="flex justify-between items-center mb-8 bg-gray-900 text-white p-4 font-semibold rounded-sm text-lg">
        <h1 className="text-2xl font-bold text-white">Admin Management Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Claims</p>
              <h3 className="text-2xl font-bold text-gray-800">{claimsHistory.total_claims}</h3>
            </div>
            <div className="p-2 bg-gray-100 rounded-md">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pending Claims</p>
              <h3 className="text-2xl font-bold text-yellow-600">{reportSummery.pending_count}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Avg. processing time: 4.2 days</p>
        </div>
        
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <h3 className="text-2xl font-bold text-red-600">{}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-md">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Rejection rate: 15.1%</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Payments</p>
            <h3 className="text-2xl font-bold text-gray-800">{reportSummery.total_payments}</h3>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">+0% from last month</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Approved Claims</p>
            <h3 className="text-2xl font-bold text-green-600">{reportSummery.approved_count}</h3>
          </div>
          <div className="p-2 bg-green-100 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Approval rate: {reportSummery.approval_rate}%</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Paid Claims</p>
            <h3 className="text-2xl font-bold text-blue-600">{reportSummery.paid_count}</h3>
          </div>
          <div className="p-2 bg-blue-100 rounded-md">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Payment rate: {reportSummery.payment_rate}%</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total Amount Paid</p>
            <h3 className="text-2xl font-bold text-gray-800">Gh&#x20B5; {reportSummery.total_amount_paid.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">+0% from last month</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Avg Claim Amount</p>
            <h3 className="text-2xl font-bold text-gray-800">Gh&#x20B5; {reportSummery.avg_claim_amount.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Based on recent claims</p>
      </div>
      </div>

      <div className="flex border-b mb-6">
        <button 
          className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'overview' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'claims' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('claims')}
        >
          All Claims
        </button>
        <button 
          className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'reports' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button  className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'settings' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-800">Recent Claims</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search claims..." 
                    className="border rounded-md pl-8 pr-2 py-1 text-sm"
                  />
                  <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                </div>
                <button 
                  className="p-1 rounded border"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            {filterOpen && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <select className="border rounded p-1 text-sm">
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>Approved</option>
                  </select>
                  <input type="text" className="border rounded p-1 text-sm" placeholder="Amount" />
                  <input type="text" className="border rounded p-1 text-sm" placeholder="Reason" />
                </div>
                <div className="flex justify-end mt-2">
                  <button className="bg-gray-600 cursor-pointer text-white px-3 py-1 rounded text-sm">Apply</button>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className='bg-gray-100 text-gray-600 text-left text-sm uppercase tracking-wider'>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {RecentClaims.data.length > 0 ? (
                            (RecentClaims?.data.map((claim, index) => (
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
                                            <span className="text-gray-300">|</span>
                                        {/* <button className="text-gray-600 hover:text-gray-800">Edit</button> */}
                                    </div>
                                </td>
                                </tr>
                            )))
                        ) : (
                            <div className='text-center'>No Recent Claims</div>
                        )}
                    </tbody>
                </table>
            </div>

            
            {/* <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">Showing 5 of 142 claims</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 border rounded text-sm bg-white">Previous</button>
                <button className="px-3 py-1 border rounded text-sm bg-gray-600 text-white">Next</button>
              </div>
            </div> */}
          </div>
          
          <div className="space-y-6">
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800 mb-4">Top Claim Processors</h2>
              <div className="space-y-3">
              {loadingProcessors ? <Loader /> : (
                topProcessors?.length > 0 ? (
                  topProcessors?.map((u) => (
                    <div key={u.name} className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{u.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: `${u.percentage}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{u.claims_processed} claims processed</span>
                      <span className="text-xs font-medium">{u.percentage}% approval</span>
                    </div>
                  </div>
                </div>
                  ))
                ) : (
                  <div>No User has processed any claim</div>
                )
              )}
              </div>
            </div>
            
            <div className="bg-white relative rounded-lg shadow-sm border border-gray-200 p-4">
              <ProcessingTime />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'claims' && (
        <div className="bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Claims History</h2>
            
            <select
              className="border border-gray-300 rounded-md p-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Claims</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {filteredClaims?.length > 0 ? (
                  filteredClaims.map((claim, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600">{claim.claim_number}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        {claim.staff?.employee?.first_name} {claim.staff?.employee?.last_name}
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
                          <button  onClick={() => openModal(claim)} className="text-gray-600 cursor-pointer hover:text-gray-800">View</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-gray-600 hover:text-gray-800">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                      No claims available for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {activeTab === 'reports' && 
            <div className="bg-white p-4 rounded-lg">
                <ClaimsReportsTab />
            </div>
        }

      {activeTab === 'settings' && <div className="bg-white p-4 rounded-lg">Settings Content</div>}

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
    </div>
  );
};

export default AdminDashboard;