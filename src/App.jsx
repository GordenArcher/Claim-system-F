
import { useContext, useEffect } from 'react';
import './App.css'
import NavBar from './layout/NavBar';
import PageRoutes from './routes/Routes'
import { ToastContainer, Bounce } from 'react-toastify';
import { AuthContext } from './utils/context/AuthContextProvider';


function App() {

  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);


  return (
    <div className='w-full h-screen'>
      {isAuthenticated && <NavBar />}

      <PageRoutes />


      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}

export default App
