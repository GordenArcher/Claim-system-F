import { useState } from "react";
import { toast } from "react-toastify";

const UnBlockUser = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [isUnBlocking, setIsUnBlocking] = useState(false)

    const handleUnBlockUser = async (userId) => {
        setIsUnBlocking(true)

        try {
          const response = await fetch(`${BASE_URL}/unblock_staff/${userId}/`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json",
                'X-CSRFToken': localStorage.getItem("csrf")
            }, credentials:"include"
        });
          
          if(response.ok){
            const data = await response.json()
            toast.success(data.message)
          }else{
            const errorData = await response.json()
            toast.error(errorData || "Please try agin")
          }
          
        } catch (error) {
          console.error('Error blocking user:', error);
        }finally{
            setIsUnBlocking(false)
        }
      };

  return {handleUnBlockUser, isUnBlocking}
}

export default UnBlockUser