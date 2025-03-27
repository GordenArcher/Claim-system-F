import { useContext } from "react"
import { APIContext } from "../utils/context/APIContextProvider"
import LogoutButton from "../components/LogoutButton";

const NavBar = () => {

  const { user } = useContext(APIContext)

  const getGreeting = () => {
    const hour = new Date().getHours();
  
    if (hour >= 5 && hour < 12) {
      return "Good Morning ☀️";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon 🌤️";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening 🌆";
    } else {
      return "Good Night 🌙";
    }
  };

  return (
    <div className="relative">
        <nav className="w-full h-[100px] text-gray-900 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-3 max-md:text-[1.3rem]  text-[2rem] font-extrabold  relative">
                  <h2>Claim System</h2>
              </div>

              <div className="flex items-center gap-1">
                <div className="p-2 max-sm:text-[.8rem] text-[1.1rem] font-extrabold ">
                  <h5 className="capitalize">{`${getGreeting()}  ${user.data?.username}`}</h5>
                </div>

                <div>
                  <LogoutButton />
                </div>
              </div>
            </div>
        </nav>
    </div>
  )
}

export default NavBar