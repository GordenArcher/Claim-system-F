import axios from 'axios'
import React, { useCallback, useState } from 'react'

const Get_processingData = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [processingTimeData, setProcessingTimeData] = useState([])

    const getProcessingTimeData = useCallback( async () => {
        try {
            const response = await axios.get(`${BASE_URL}/reports/processing-time/` ,{ withCredentials:true} );
      
            if(response.data){
              setProcessingTimeData(response.data.data)
            }
          
          } catch (error) {
            console.error('Error getting processing time data:', error);
          }

      }, [BASE_URL]) 

  return {processingTimeData, getProcessingTimeData}
}

export default Get_processingData