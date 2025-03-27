import { Loader } from "lucide-react";
import { useContext, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { toast } from "react-toastify";
import { APIContext } from "../../utils/context/APIContextProvider";

const Register = () => {
  const { user } = useContext(APIContext)

    const role = user?.data?.role;

  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role: "",
    password: "",
    password2: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const registerUser = async (e) => {
    e.preventDefault();

    if(!registerData.full_name || !registerData.email || !registerData.phone_number || !registerData.password || !registerData.password2) return toast.error("All fields are required")

    if(!registerData.password !== !registerData.password2) return toast.error("password does not match")

    setIsSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/register/`, {
        method:"POST", 
        headers:{
          "Content-Type": "application/json",
          'X-CSRFToken': localStorage.getItem("csrf"),
        }, 
        body: JSON.stringify({
          full_name: registerData.full_name,
          email: registerData.email,
          phone_number: registerData.phone_number,
          role: registerData.role || "accountant",
          password: registerData.password,
          password2: registerData.password2,
        }), credentials:"include"})
  
      if(response.ok){
        const data = await response.json()
        toast.success(data.message)
      }
      else{
        const errorData = await response.json()
        toast.error(errorData.message)
        console.log(errorData)
      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsSubmitting(false)
    }
  };

  const availableRoles = role === 'administrator'
  ? [{ id: "accountant", label: "Accountant" }]
  : [
      { id: "accountant", label: "Accountant" },
      { id: "administrator", label: "Administrator" }
    ];

  return (
    <div className="w-full">
      <div className="max-w-[600px] m-auto h-screen flex items-center justify-center">
        <section className="w-full bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-center text-2xl font-bold text-black">
          <Typewriter
            words={['Create an account']}
            loop={true}
            cursor
            cursorStyle="."
            typeSpeed={100}
            deleteSpeed={70}
          />
            
          </h2>
          <form className="mt-8" onSubmit={registerUser}>
            <div className="space-y-5">
              <div >
                <label className="text-base font-medium text-gray-900">Full Name</label>
                <input
                  type="text"
                  placeholder={"Gorden Archer"}
                  value={registerData.full_name}
                  name="full_name"
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, full_name: e.target.value }))}
                  className={`mt-2 flex h-10 w-full rounded-md border outline-none px-3 py-2 text-sm focus:ring-1 border-gray-300`}
                />
              </div>

                <div className="relative">
                  <label className="text-base font-medium text-gray-900">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    name="email"
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`mt-2 flex h-10 w-full rounded-md border outline-none px-3 py-2 text-sm focus:ring-1 border-gray-300`}
                  />
                </div>

                <div className="relative">
                  <label className="text-base font-medium text-gray-900">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="233 123456789"
                    name="phone_number"
                    value={registerData.phone_number}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, phone_number: e.target.value }))}
                    className="mt-2 flex h-10 w-full rounded-md border outline-none px-3 py-2 text-sm focus:ring-1 border-gray-300"
                  />
                </div>

              <div className="flex flex-col gap-3">
                <p className="text-gray-700 font-medium text-base">Select Role</p>
                <div className="flex gap-3">
                {availableRoles.map((roleOption) => (
                    <div key={roleOption.id}>
                      <input className="peer hidden" type="radio" id={roleOption.id} name="role" value={roleOption.id} onChange={(e) => setRegisterData((prev) => ({ ...prev, role: e.target.value }))} />
                      <label htmlFor={roleOption.id} className="flex cursor-pointer items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 peer-checked:border-gray-500 peer-checked:bg-gray-500 peer-checked:text-white">
                        {roleOption.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

                <div className="relative">
                  <label className="text-base font-medium text-gray-900"> Password </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                    className="mt-2 flex h-10 w-full rounded-md border outline-none px-3 py-2 text-sm focus:ring-1 border-gray-300"
                  />
                </div>

                <div className="relative">
                  <label className="text-base font-medium text-gray-900"> Confirm Password </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    name="password2"
                    value={registerData.password2}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password2: e.target.value }))}
                    className="mt-2 flex h-10 w-full rounded-md border outline-none px-3 py-2 text-sm focus:ring-1 border-gray-300"
                  />
                </div>

              <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-10 cursor-pointer rounded-md px-4 py-2 font-semibold text-white ${
                  isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isSubmitting ? <div className="flex items-center justify-center"><Loader className="animate-spin" /> Registering...</div> : "Register"}
              </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
