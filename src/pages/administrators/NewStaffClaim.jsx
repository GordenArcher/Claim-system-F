import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Back from '../../components/Back';

const StaffClaim = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    employee_email: '',
    phone_number: '',
    claim_amount: '',
    claim_reason: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/create_claim/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': localStorage.getItem("csrf"),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Claim submitted successfully!");
        setFormData({
          first_name: '',
          last_name: '',
          employee_email: '',
          phone_number: '',
          claim_amount: '',
          claim_reason: '',
        });
      } else {
        toast.error(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast.error("Failed to submit claim. Please try again.");
    }
  };

  return (
    <div className='p-5'>

    <Back />

     <div className="bg-gray-900 text-white p-4 rounded-lg font-semibold text-lg mb-5">
        Submit a Staff Claim
      </div>
      
        <div className="p-7 max-w-lg mx-auto">
          <h3 className="text-xl font-black text-gray-900 mb-4">Submit a New Claim</h3>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              name="first_name" 
              placeholder="First Name" 
              value={formData.first_name} 
              onChange={handleChange} 
              required 
              className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
            />
            <input 
              type="text" 
              name="last_name" 
              placeholder="Last Name" 
              value={formData.last_name} 
              onChange={handleChange} 
              required 
              className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
            />
          </div>
          <input 
            type="email" 
            name="employee_email" 
            placeholder="Email" 
            value={formData.employee_email} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
          <input 
            type="tel" 
            name="phone_number" 
            placeholder="Phone Number" 
            value={formData.phone_number} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
          <input 
            type="number" 
            name="claim_amount" 
            placeholder="Claim Amount" 
            value={formData.claim_amount} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
          <textarea 
            name="claim_reason" 
            placeholder="Claim Reason" 
            value={formData.claim_reason} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded outline-none resize-none w-full h-24 focus:ring focus:ring-gray-200"
          />
          <button 
            type="submit" 
            className="bg-gray-800 text-white px-6 py-3 rounded w-full hover:bg-gray-700 transition shadow-md"
          >
            Submit Claim
          </button>
        </form>
        </div>

    </div>
    
  );
};

export default StaffClaim;
