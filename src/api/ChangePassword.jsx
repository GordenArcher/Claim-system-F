import { useCallback, useState } from "react"
import { toast } from "react-toastify"

const ChangePassword = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const change_password = useCallback( async (profileData) => {

      setIsChangingPassword(true)

      if (profileData.newPassword !== profileData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }

      try {
          const response = await fetch(`${BASE_URL}/profile/change_password/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': localStorage.getItem("csrf"),
            },
            body: JSON.stringify({
                "old_password": profileData?.currentPassword,
                "new_password": profileData?.newPassword,
                "new_password2": profileData?.confirmPassword
            }) ,
            credentials: "include",
          })
          console.log(profileData)
  
          if (response.ok){
            const data = await response.json()
            toast.success(data.message)
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