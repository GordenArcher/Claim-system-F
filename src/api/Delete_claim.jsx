import axios from 'axios';
import { useState } from 'react'
import { toast } from 'react-toastify';


    const DeleteClaim = () => {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL
        const [isdeletingClaim, setIsdeletingClaim] = useState(false)
        
        const handleDeleteClaim = async (request_number) => {

            setIsdeletingClaim(true)

            try {
                const response = await axios.delete(`${BASE_URL}/delete_claim/${request_number}/`,{headers:{'X-CSRFToken': localStorage.getItem("csrf"),}, withCredentials:true} );
    
                toast.success(response.data.message);

                setTimeout(() => {
                    window.location.reload()
                }, 400)
              
            } catch (error) {
              console.error('Error deleting claim:', error);
            }finally{
                setIsdeletingClaim(false)
            }
        };
    
      return {handleDeleteClaim, isdeletingClaim}
    }
    

export default DeleteClaim