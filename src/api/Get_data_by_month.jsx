import{ useState } from 'react'
import { toast } from 'react-toastify';

// This api gets all paid claims by querying within months
const Get_data_by_month = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [loadingg, setLoading] = useState(false);
    const [monthlyData, setMonthlyData] = useState([])


    const get_claimMonth = async (query) => {

        setLoading(true);
        try {
        const response = await fetch(`${BASE_URL}/get_query-dataa/?month=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json()
            return setMonthlyData(data.data)
        } else {
            const errorData = await response.json()
            toast.error(errorData)
        }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };


  return {loadingg, get_claimMonth, monthlyData}
}

export default Get_data_by_month
