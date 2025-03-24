import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../utils/context/AuthContextProvider';

const Get_all_users = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [users, setUsers] = useState([]);
    const [isGettingUsers, setIsGettingUsers] = useState(false)
    const { isAuthenticated } = useContext(AuthContext)

    useEffect(() => {
        const fetchUsers = async () => {

            setIsGettingUsers(true)
    
            try {
              const response = await fetch(`${BASE_URL}/users/`,{
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
              })
    
              if(response.ok){
                const data = await response.json()
                setUsers(data.data);
              }else{
                const errData = await response.json()
                console.log(errData)
              }
              
            } catch (error) {
              console.error('Error fetching users:', error);
            }finally{
                setIsGettingUsers(false)
            }
        };

        if(isAuthenticated){
            fetchUsers()
        }
        
    }, [BASE_URL, isAuthenticated])

  return {isGettingUsers, users}
}

export default Get_all_users