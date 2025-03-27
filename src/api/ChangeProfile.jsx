import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

const ChangeProfile = () => {

    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [isSettingProfile, setIsSettingProfile] = useState(false)

    const change_profile = useCallback( async (profileData) => {

        setIsSettingProfile(true)

        try {
            const response = await fetch(`${BASE_URL}/profile/change_profile/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': localStorage.getItem("csrf"),
                },
                body: JSON.stringify({
                    "username": profileData?.username,
                    "email": profileData?.email,
                    "phone_number": profileData?.phoneNumber
                }) ,
                credentials: "include",
            })
            console.log(profileData)
    
            if (response.ok){
                const data = await response.json()
                toast.success(data.message)
                console.log(data)
            }
            else{
                const errorData = await response.json()
                toast.success(errorData.message)
                console.log(errorData)
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsSettingProfile(false)
        }
    },
       [BASE_URL],
     )
       

  return {isSettingProfile, change_profile}
}

export default ChangeProfile