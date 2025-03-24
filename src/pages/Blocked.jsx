import React from 'react';
import { ShieldAlert, Mail, Phone } from 'lucide-react';

const Blocked = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 flex flex-col items-center">
          <div className="animate-bounce mb-4">
            <ShieldAlert className="text-white" size={72} />
          </div>
          <div className="h-2 w-12 bg-white/30 rounded-full"></div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Access Blocked</h2>
          
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
            <p className="text-red-700">
              Your account has been temporarily restricted. You currently do not have permission to access this system.
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            Please contact the system administrator to request access authorization. 
            Be sure to include your username and department in your communication.
          </p>
          
          {/* <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <Mail className="mr-3 text-gray-500" size={20} />
              <span>admin@company.com</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Phone className="mr-3 text-gray-500" size={20} />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          
          <button 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
            onClick={() => window.location.href = 'mailto:admin@company.com'}
          >
            Contact Administrator
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Blocked;