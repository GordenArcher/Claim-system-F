import { useState } from "react";
import { toast } from "react-toastify";

const BlockUser = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [isBlocking, setIsBlocking] = useState(false)

    const handleBlockUser = async (userId) => {

        setIsBlocking(true)

        try {
          const response = await fetch(`${BASE_URL}/block_staff/${userId}/`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json",
                'X-CSRFToken': localStorage.getItem("csrf")
            }, credentials:"include"
        });
          
          if(response.ok){
            const data = await response.json()
            console.log(data)
            toast.success(data.message)
          }else{
            const errorData = await response.json()
            toast.error(errorData || "Please try agin")
          }
          
        } catch (error) {
          console.error('Error blocking user:', error);
        }finally{
            setIsBlocking(false)
        }
      };

  return {handleBlockUser, isBlocking}
}

export default BlockUser