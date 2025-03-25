import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'


// This api gets summery of reports like 
    // "total_payments": 0,
    // "total_amount_paid": 84791.0,
    // "avg_claim_amount": 12113.0,
    // "pending_count": 0,
    // "approved_count": 0,
    // "paid_count": 7,
    // "approval_rate": 100.0,
    // "payment_rate": 100.0


const Get_report_summery = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [summeryReports, setSummeryReports] = useState([])

    useEffect(() => {
        const get_All_Claim = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/reports/claims-summary/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setSummeryReports(data);
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
            get_All_Claim()
        }

    }, [BASE_URL, isAuthenticated])
    
    return {loading, error, summeryReports};
}

export default Get_report_summery