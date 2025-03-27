import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'


// This api gets the top 3 claim processes
const Get_staff_processes = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loadingProcessors, setLoadingProcessors] = useState(false);
    const [topProcessors, setTopProcessors] = useState([])

    useEffect(() => {
        const get_All_Claim = async () => {

            setLoadingProcessors(true);
            try {
            const response = await fetch(`${BASE_URL}/claim_processed/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setTopProcessors(data.data);
            } else {
                const errorData = await response.json();
                setError(errorData);
            }
            } catch (err) {
            console.log(err);
            } finally {
            setLoadingProcessors(false);
            }
        };

        if(isAuthenticated) {
            get_All_Claim()
        }

    }, [BASE_URL, isAuthenticated])
    
    return {loadingProcessors, error, topProcessors};
}

export default Get_staff_processes