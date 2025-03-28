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
import OverviewClaimsFilter from '../../components/OverViewClaim';
import ClaimsTable from '../../components/ClaimsTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
        <button className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'overview' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'claims' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`} onClick={() => setActiveTab('claims')}>
          All Claims
        </button>
        <button className={`px-4 cursor-pointer py-2 font-medium ${activeTab === 'reports' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-600'}`} onClick={() => setActiveTab('reports')}>
          Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OverviewClaimsFilter RecentClaims={RecentClaims} getStatusIcon={getStatusIcon} getStatusClass={getStatusClass} openModal={openModal} />
          
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
        <ClaimsTable claimsHistory={claimsHistory} openModal={openModal} />
      )}

        {activeTab === 'reports' && 
            <div className="bg-white p-4 rounded-lg">
                <ClaimsReportsTab />
            </div>
        }

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