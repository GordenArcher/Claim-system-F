import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'


// This api gets all paid claims either pending or paid in the system for history
const Get_all_claims = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [allClaims, setAllClaims] = useState([])

    useEffect(() => {
        const get_All_Claim = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/all_claims/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setAllClaims(data);
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
    
    return {loading, error, allClaims};
}

export default Get_all_claims