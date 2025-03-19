// 

import { useCallback, useState } from "react"
import { toast } from "react-toastify"

const Pay_Claim = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [isLoading, setIsLoading] = useState(false)

    const claim_payment = useCallback( async ( claim_number, staff_phone,) => {

        setIsLoading(true)

        try {
            const response = await fetch(`${BASE_URL}/claim/staff/pay/${claim_number}/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': localStorage.getItem("csrf"),
                },
                body: JSON.stringify({
                    "staff_phone": staff_phone,
                }) ,
                credentials: "include",
            })
    
            if (response.ok){
                const data = await response.json()
                toast.success(data.message)
                console.log(data)
            }
            else{
                const errorData = await response.json()
                toast.success(errorData.message)
                console.log(errorData)
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    },
       [BASE_URL],
     )
       

  return {isLoading, claim_payment}
}

export default Pay_Claim
