import './App.css'
import NavBar from './layout/NavBar';
import PageRoutes from './routes/Routes'
import { ToastContainer, Bounce } from 'react-toastify';


function App() {

  return (
    <div className='w-full h-screen'>
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
