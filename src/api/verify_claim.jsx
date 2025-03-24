import { useState } from "react";
import { toast } from "react-toastify";

// This api gets a particular staff's claim to verify if it's paid or pending
const Verify_Claim = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [staff_claim, setStaff_claim] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const get_Claim = async (claim_id) => {
    if (!claim_id) return toast.error("Claim ID is required");
    
    setError(null);
    setStaff_claim(null);
    setLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/claim/verify/${claim_id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      
      if (response.ok) {
      const data = await response.json();
        setStaff_claim(data);
      } else {

        const errorData = await response.json();
        const errorMessage = typeof errorData === 'string' ? errorData : errorData.detail || errorData.message || "Failed to retrieve claim information";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("API call error:", err);
      setError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simple function to clear the current claim data
  const clearClaim = () => {
    setStaff_claim(null);
    setError(null);
  };

  return { staff_claim, loading, error, get_Claim, clearClaim };
};

export default Verify_Claim;