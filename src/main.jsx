import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './utils/context/AuthContextProvider.jsx'
import APIContextProvider from './utils/context/APIContextProvider.jsx'
import Loader from './components/PageLoader.jsx'
const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
      <APIContextProvider>
        <Suspense fallback={ <Loader />}>
          <App />
        </Suspense>
      </APIContextProvider>
    </AuthContextProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
