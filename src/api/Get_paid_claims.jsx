import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'

// This api gets all paid claims for today eg if today is Monday, it only gets monday paid claims else it'll return empty

const Get_paid_claims = () => {

    const { isAuthenticated } = useContext(AuthContext)

    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [paidData, setPaidData] = useState([])

    useEffect(() => {
        const paid_Claim = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/claims/paid/today/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setPaidData(data);
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
            paid_Claim()
        }

    }, [BASE_URL, isAuthenticated])
    
    return {loading, error, paidData};
}


export default Get_paid_claims