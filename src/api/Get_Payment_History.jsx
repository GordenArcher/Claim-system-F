import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'

const Get_Payment_History = () => {

 const { isAuthenticated } = useContext(AuthContext)

    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([])

    useEffect(() => {
        const paymentHistory = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/claim/payments/history/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setPaymentHistory(data);
            } else {
                const errorData = await response.json();
                setError(errorData);
            }
            } catch (err) {
            console.log(err);
            } finally {
            setLoading(false);
            }
        };

        if(isAuthenticated) {
            paymentHistory()
        }

    }, [BASE_URL, isAuthenticated])
    
    return {loading, error, paymentHistory};
}

export default Get_Payment_History