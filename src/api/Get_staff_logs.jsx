import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'


// This api gets all all the logs for user activities (logingin, logingout etc)
export const Get_users_logs = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [systemLogs, setSystemLogs] = useState([])

    useEffect(() => {
        const get_logs = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/system/logs/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setSystemLogs(data.logs);
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
            get_logs()
        }

    }, [BASE_URL, isAuthenticated])
    
    return {loading, error, systemLogs};
}


// // This api gets all all the logs for claim processing activities (accountant claimed ... for a staff etc)
// export const Get_claim_logs = () => {
//     const { isAuthenticated } = useContext(AuthContext)
//     const BASE_URL = import.meta.env.VITE_BACKEND_URL
//     const [error, setError] = useState(null)
//     const [loading, setLoading] = useState(false);
//     const [claim_logs, setClaim_logs] = useState([])

//     useEffect(() => {
//         const get_logs = async () => {

//             setLoading(true);
//             try {
//             const response = await fetch(`${BASE_URL}/logs/claims/`, {
//                 method: "GET",
//                 headers: {
//                 "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//             });
    
//             if (response.ok) {
//                 const data = await response.json();
//                 setClaim_logs(data.logs);
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData);
//             }
//             } catch (err) {
//             console.log(err);
//             } finally {
//             setLoading(false);
//             }
//         };

//         if(isAuthenticated) {
//             get_logs()
//         }

//     }, [BASE_URL, isAuthenticated])
    
//     return {loading, error, claim_logs};
// }



// // This api gets all all the logs for payments (amount of .. madde by  ... for staff etc)
// export const Get_payment_logs = () => {
//     const { isAuthenticated } = useContext(AuthContext)
//     const BASE_URL = import.meta.env.VITE_BACKEND_URL
//     const [error, setError] = useState(null)
//     const [loading, setLoading] = useState(false);
//     const [payment_logs, setPayment_logs] = useState([])

//     useEffect(() => {
//         const get_logs = async () => {

//             setLoading(true);
//             try {
//             const response = await fetch(`${BASE_URL}/logs/payments/`, {
//                 method: "GET",
//                 headers: {
//                 "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//             });
    
//             if (response.ok) {
//                 const data = await response.json();
//                 setPayment_logs(data.logs);
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData);
//             }
//             } catch (err) {
//             console.log(err);
//             } finally {
//             setLoading(false);
//             }
//         };

//         if(isAuthenticated) {
//             get_logs()
//         }

//     }, [BASE_URL, isAuthenticated])
    
//     return {loading, error, payment_logs};
// }