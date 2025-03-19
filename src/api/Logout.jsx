import React, { useContext, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider'
import { toast } from 'react-toastify'

const Logout = () => {
    const { setIsAuthenticated } = useContext(AuthContext)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const logoutUser = async () => {
        setIsLoggingOut(true)
        
        try {
            const response = await fetch(`${BASE_URL}/auth/logout/`, {
                method: "POST", 
                headers: {
                    "Content-Type":"application/json" ,
                    'X-CSRFToken': localStorage.getItem("csrf"),
                }, 
                credentials:"include"
            })

            if(response.ok){
                const data = await response.json()
                setIsAuthenticated(false)
                toast.success(data.message)
            }
            else{
                const errorData = await response.json()
                toast.success(errorData.message)
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoggingOut(false)
        }
    }
  return {logoutUser, isLoggingOut}
}

export default Logout