import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Back from '../../components/Back';
import DatePicker from 'react-datepicker';
import { formatISO } from 'date-fns';
import { Loader } from 'lucide-react';
import ErrorNotification from '../../components/ErrorNotification';
import { Typewriter } from 'react-simple-typewriter';

const StaffClaim = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [duplicateError, setDuplicateError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    request_number: '',
    employee_number: '',
    full_name: '',
    posting_date: '',
    phone_number: '',
    claim_amount: '',
    claim_reason: '',
    payment_date : ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true)

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
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        setFormData({
          claim_amount: '',
          full_name : '',
          posting_date : '',
          phone_number : '',
          employee_number : '',
          request_number : '',
          claim_reason : '',
          payment_date : ''
        });
        location.reload()
      } else {
        const errorData = await response.json();

        if(errorData.type == "duplicate"){
          setDuplicateError(errorData);
          <ErrorNotification errorData={errorData} />
        }else{
          toast.error(`${errorData.message || "Something went wrong"}`);
        }
        
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast.error("Failed to submit claim. Please try again.");
    }finally{
      setIsSubmitting(false)
    }
  };

  const dismissErrorNotification = () => {
    setDuplicateError(null);
  };

  return (
    <div className='p-5'>

    <Back />
      {/* 
        <div className="bg-gray-900 text-white p-4 rounded-lg font-semibold text-lg mb-5">
          Submit a Staff Claim
        </div> 
      */}
      
      <div className="p-1 max-w-lg mx-auto">
      <h2 className="text-center text-2xl font-bold text-black">
      <Typewriter
        words={['Submit a New Claim']}
        loop={true}
        cursor
        cursorStyle="."
        typeSpeed={100}
        deleteSpeed={70}
      />
        
      </h2>
      <p className="text-sm text-gray-500 mb-4">Please cross check the information before submitting</p>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div className="space-y-1">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            id="full_name"
            name="full_name" 
            value={formData.full_name} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div>
          
        <div className="space-y-1">
          <label htmlFor="employee_number" className="block text-sm font-medium text-gray-700">Employee Number</label>
          <input 
            type="text" 
            id="employee_number"
            name="employee_number" 
            value={formData.employee_number} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div>
          
        <div className="space-y-1">
          <label htmlFor="request_number" className="block text-sm font-medium text-gray-700">Request Number</label>
          <input 
            type="text" 
            id="request_number"
            name="request_number" 
            value={formData.request_number} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="employee_email" className="block text-sm font-medium text-gray-700">Posting Date</label>
          <DatePicker 
            required
            onChange={(date) => setFormData((prevData) => ({...prevData, posting_date: formatISO(date)}))}
            dateFormat="yyyy-MM-dd"
            selected={formData.posting_date}
            id="employee_email"
            name="posting_date"
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="tel" 
            id="phone_number"
            name="phone_number" 
            value={formData.phone_number} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div>

        <div className="space-y-1 flex gap-3">
          {["pending", "paid"].map((roleOption) => (
            <div key={roleOption}>
              <input className="peer hidden" type="radio" id={roleOption} name="status" value={roleOption} onChange={handleChange} />
              <label htmlFor={roleOption} className="flex cursor-pointer items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 peer-checked:border-gray-500 peer-checked:bg-gray-500 peer-checked:text-white">
                {roleOption}
              </label>
            </div>
          ))}
        </div>

        {formData.status === 'paid' && (
         <div className="space-y-1">
          <label htmlFor="claim_amount" className="block text-sm font-medium text-gray-700">Payment Date</label>
          <DatePicker 
            id="claim_amount"
            name="payment_date" 
            dateFormat="yyyy-MM-dd"
            selected={formData.payment_date}
            onChange={(date) => setFormData((prevData) => ({...prevData, payment_date: formatISO(date)}))}
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div> 
        )}

        <div className="space-y-1">
          <label htmlFor="claim_amount" className="block text-sm font-medium text-gray-700">Claim Amount</label>
          <input 
            type="number" 
            id="claim_amount"
            name="claim_amount" 
            value={formData.claim_amount} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded w-full outline-none focus:ring focus:ring-gray-200"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="claim_reason" className="block text-sm font-medium text-gray-700">Claim Reason</label>
          <textarea 
            id="claim_reason"
            name="claim_reason" 
            value={formData.claim_reason} 
            onChange={handleChange} 
            required 
            className="p-3 border border-gray-300 rounded outline-none resize-none w-full h-24 focus:ring focus:ring-gray-200"
          />
        </div>

        <button type="submit" className="bg-gray-800 cursor-pointer text-white px-6 py-3 rounded w-full hover:bg-gray-700 transition shadow-md">
          {isSubmitting ? (
            <div className='flex items-center justify-center gap-2'>
              <Loader className='size-5 animate-spin' />
              <span>Submitting...</span>
            </div>
          ) : "Submit"}
        </button>
      </form>
    </div>

    {duplicateError && (
      <ErrorNotification 
        errorData={duplicateError} 
        onDismiss={dismissErrorNotification} 
      />
    )}

  </div>
    
  );
};

export default StaffClaim;
