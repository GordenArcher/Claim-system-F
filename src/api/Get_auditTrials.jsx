import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'


// This api gets the audit Trails ( all actions performed in the system )
const Get_audit = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [allAudit, setAllAudit] = useState([])

    useEffect(() => {
        const get_All_Claim = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/system_audits/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setAllAudit(data.data);
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
    
    return {loading, error, allAudit};
}

export default Get_audit