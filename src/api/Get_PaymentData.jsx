import axios from 'axios'
import React, { useCallback, useState } from 'react'

const Get_PaymentData = () => {

    const BASE_URL = import.meta.env.VITE_BACKEND_URL


    const [paymentData, setPaymentData] = useState([])
  
    const getPaymentData = useCallback( async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reports/monthly-payments/`, {withCredentials:true} );
  
        if(response.data){
          setPaymentData(response.data.data)
        }
      
      } catch (error) {
        console.error('Error getting payment data:', error);
      }
    }, [BASE_URL])

  return {getPaymentData, paymentData}
}

export default Get_PaymentData