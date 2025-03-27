import { useCallback, useState } from "react"
import { toast } from "react-toastify"

const ChangePassword = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const change_password = useCallback( async (profileData) => {

      if(profileData.newPassword !== profileData.confirmPassword) return toast.error("New passwords don't match");

      setIsChangingPassword(true)
      try {
          const response = await fetch(`${BASE_URL}/staff/change_password/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': localStorage.getItem("csrf"),
            },
            body: JSON.stringify({
                "currentPassword": profileData?.currentPassword,
                "newPassword": profileData?.newPassword,
                "confirmPassword": profileData?.confirmPassword
            }) ,
            credentials: "include",
          })
  
          if (response.ok){
            const data = await response.json()
            toast.success(data.message)
            profileData.currentPassword = ""
            profileData.newPassword = ""
            profileData.confirmPassword = ""
          }
          else{
            const errorData = await response.json()
            toast.error(errorData.message)
          }
      } catch (error) {
          console.log(error)
      }finally{
        setIsChangingPassword(false)
      }
  },
     [BASE_URL],
   )
     

return {isChangingPassword, change_password}
}


export default ChangePassword