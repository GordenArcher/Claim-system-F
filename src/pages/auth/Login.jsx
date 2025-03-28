import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify";
import { AuthContext } from "../../utils/context/AuthContextProvider";
import { Loader } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from 'framer-motion'

const Login = () => {

  const {setIsAuthenticated} = useContext(AuthContext)

  const [showResetPopUp, setShowResetPopUp] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email : "",
    password : "",
  }) 

  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const logUserIn =  async (e) => {
    e.preventDefault()

    if(!loginData.email || !loginData.password) return toast.error("All fields are required")

    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method:"POST", 
        headers:{
          "Content-Type": "application/json",
          'X-CSRFToken': localStorage.getItem("csrf"),
        }, 
        body: JSON.stringify({"email": loginData.email, "password": loginData.password}), credentials:"include"})
  
      if(response.ok){
        const data = await response.json()
        toast.success(data.message)
        setIsAuthenticated(data.auth)
      }
      
      else{
        const errorData = await response.json()
        toast.error(errorData.message)
        console.log(errorData)
      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <div className="max-w-[500px]  m-auto h-full flex items-center justify-center ">
        <section className="w-full bg-white shadow-2xl rounded-xl">
          <div className="w-full flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
            <div className="w-full flex flex-col gap-[20px] p-4">
              <div className="mb-2 flex justify-center"></div>
              <h2 className="text-center text-2xl font-bold leading-tight text-black">
              <Typewriter
                  words={['Sign in']}
                  loop={true}
                  cursor
                  cursorStyle="."
                  typeSpeed={100}
                  deleteSpeed={70}
                />
              </h2>
              <form className="mt-8" onSubmit={logUserIn}>
                <div className="space-y-9">
                  <div>
                    <label className="text-base font-medium text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prevData) => ({...prevData, email: e.target.value}))}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-base font-medium text-gray-900">
                        Password
                      </label>
                      <Link
                        className="text-sm font-semibold text-black hover:underline"
                        title="password reset"
                        onClick={() => setShowResetPopUp((prevState) => !prevState )}
                        to="#">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="mt-2">
                      <input
                        placeholder="Password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData((prevData) => ({...prevData, password: e.target.value}))}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <button disabled={isLoading} className="inline-flex outline-none cursor-pointer w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80" type="submit">
                      {isLoading ? (<div className="flex items-center gap-0.5"><Loader className="animate-spin" /> Please wait...</div>) : "Log in"}
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-3 space-y-3">
              </div>
            </div>
          </div>
        </section>
      </div>

      {showResetPopUp && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={setShowResetPopUp(false)}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}>
            <div className="p-4">
              <h3>Please reach out to the System Administrator to reset your password</h3>
            </div>
          </motion.div>
        </>
      )
      }

    </div>
    
  )
}

export default Login