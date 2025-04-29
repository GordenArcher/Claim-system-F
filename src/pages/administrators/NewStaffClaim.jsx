import React, { useState, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import Back from '../../components/Back';
import { Loader, Upload, File, X } from 'lucide-react';
import ErrorNotification from '../../components/ErrorNotification';
import axios from 'axios';
import { APIContext } from '../../utils/context/APIContextProvider';

const StaffClaim = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [duplicateError, setDuplicateError] = useState(null);

  const { setclaimsHistory } = useContext(APIContext)

  const re_fetch_claims = async () => {
    const response = await axios.get(`${BASE_URL}/all_claims/`, {withCredentials: true})
    if(response){
      const data = response?.data
      setclaimsHistory(data.data)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an Excel file.");

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/upload_claim/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': localStorage.getItem('csrf'),
        },
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        if (data.duplicates && data.duplicates.length > 0) {
          setDuplicateError({
            message: `${data.duplicates.length} duplicate claim(s) found`,
            claims: data?.duplicates,
          });
        }
        await re_fetch_claims()

      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error uploading claim:', error);
      toast.error('Failed to upload the claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <Back />
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Upload Excel File</h1>
        <p className="text-gray-600 mb-6">Please upload the Excel file for the claim submission</p>

        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-gray-900 bg-blue-50' : 'border-gray-300 hover:border-gray-900'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input 
              type="file"
              name='file'
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".xlsx,.xls"
              className="hidden"
            />
            
            {file ? (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center bg-gray-100 rounded-lg p-3 pr-4 max-w-full">
                  <File className="h-5 w-5 text-gray-900 mr-2" />
                  <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                  <button 
                  type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="ml-2 text-gray-500 cursor-pointer hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
                </p>
                <p className="text-gray-500 text-sm">Excel files only (.xlsx, .xls)</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg ${
                isSubmitting || !file 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-gray-900 cursor-pointer hover:bg-gray-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </form>
      </div>

      {duplicateError && (
        <ErrorNotification
          errorData={duplicateError}
          onDismiss={() => setDuplicateError(null)}
        />
      )}
    </div>
  );
};

export default StaffClaim;