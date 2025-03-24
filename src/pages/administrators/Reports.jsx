import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';

export default function ClaimsReportsTab() {
  const [selectedReport, setSelectedReport] = useState('totalPayments');
  const [dateRange, setDateRange] = useState('thisMonth');
  
  const paymentData = [
    { month: 'Jan', amount: 145000 },
    { month: 'Feb', amount: 162000 },
    { month: 'Mar', amount: 178000 },
    { month: 'Apr', amount: 191000 },
    { month: 'May', amount: 185000 },
    { month: 'Jun', amount: 195000 }
  ];
  
  const statusData = [
    { name: 'Approved', value: 65 },
    { name: 'Pending', value: 20 },
    { name: 'Denied', value: 10 },
    { name: 'Under Review', value: 5 }
  ];
  
  const processingTimeData = [
    { day: 'Mon', time: 3.2 },
    { day: 'Tue', time: 2.8 },
    { day: 'Wed', time: 3.5 },
    { day: 'Thu', time: 2.9 },
    { day: 'Fri', time: 3.7 }
  ];
  
  const COLORS = ['#0088FE', '#FF8042', '#FF0000', '#FFBB28'];
  
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };
  
  const renderReport = () => {
    switch (selectedReport) {
      case 'totalPayments':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Total Payments Made</h3>
            <BarChart width={600} height={300} data={paymentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" name="Payment Amount" fill="#4F46E5" />
            </BarChart>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">Summary:</p>
              <p>Total Payments: {formatCurrency(paymentData.reduce((sum, item) => sum + item.amount, 0))}</p>
              <p>Average Monthly Payment: {formatCurrency(paymentData.reduce((sum, item) => sum + item.amount, 0) / paymentData.length)}</p>
              <p>Highest Month: {paymentData.reduce((max, item) => item.amount > max.amount ? item : max, paymentData[0]).month}</p>
            </div>
          </div>
        );
      case 'claimStatus':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
            <div className="flex items-center justify-center">
              <PieChart width={400} height={300}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">Summary:</p>
              <p>Total Claims: 500</p>
              <p>Approval Rate: 65%</p>
              <p>Denial Rate: 10%</p>
            </div>
          </div>
        );
      case 'processingTime':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Average Processing Time (Days)</h3>
            <LineChart width={600} height={300} data={processingTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} days`, 'Processing Time']} />
              <Legend />
              <Line type="monotone" dataKey="time" name="Average Processing Time" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">Summary:</p>
              <p>Average Processing Time: {(processingTimeData.reduce((sum, item) => sum + item.time, 0) / processingTimeData.length).toFixed(1)} days</p>
              <p>Fastest Day: {processingTimeData.reduce((min, item) => item.time < min.time ? item : min, processingTimeData[0]).day} ({processingTimeData.reduce((min, item) => item.time < min.time ? item : min, processingTimeData[0]).time} days)</p>
              <p>Slowest Day: {processingTimeData.reduce((max, item) => item.time > max.time ? item : max, processingTimeData[0]).day} ({processingTimeData.reduce((max, item) => item.time > max.time ? item : max, processingTimeData[0]).time} days)</p>
            </div>
          </div>
        );
      default:
        return <div>Select a report to view</div>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Claims Reports</h2>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <Calendar className="h-4 w-4 mr-2" />
              {dateRange === 'thisMonth' ? 'This Month' : 'Custom Range'}
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button 
            className={`p-3 border rounded-lg text-center ${selectedReport === 'totalPayments' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setSelectedReport('totalPayments')}
          >
            Total Payments Made
          </button>
          <button 
            className={`p-3 border rounded-lg text-center ${selectedReport === 'claimStatus' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setSelectedReport('claimStatus')}
          >
            Claims by Status
          </button>
          <button 
            className={`p-3 border rounded-lg text-center ${selectedReport === 'processingTime' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setSelectedReport('processingTime')}
          >
            Processing Time
          </button>
        </div>
        
        <div className="flex justify-center">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}