import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../utils/context/AuthContextProvider"

const Get_User = () => {

    const { isAuthenticated } = useContext(AuthContext)

    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([])

    useEffect(() => {
        const get_current_user = async () => {

            setLoading(true);
            try {
            const response = await fetch(`${BASE_URL}/profile/get_user/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
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
            get_current_user()
        }

    }, [BASE_URL, isAuthenticated])
    
    return {loading, error, userData};
}

export default Get_User



