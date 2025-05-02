import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteUser = () => {

    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [isdeletingUser, setIsdeletingUser] = useState(false)

    const handleDeleteUser = async (userId) => {

        setIsdeletingUser(true)

        try {
            const response = await axios.delete(`${BASE_URL}/delete_staff/${userId}/`,{headers:{'X-CSRFToken': localStorage.getItem("csrf"),}, withCredentials:true} );

            toast.success(response.data.message);
          
        } catch (error) {
          console.error('Error deleting user:', error);
        }
    };

  return {handleDeleteUser, isdeletingUser}
}

export default DeleteUser