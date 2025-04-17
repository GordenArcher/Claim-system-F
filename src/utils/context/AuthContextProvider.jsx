import { createContext, useCallback, useEffect, useState } from "react"

export const AuthContext = createContext()


const AuthContextProvider = ({children}) => {
    

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoadingAuth, setIsLoadingAuth] = useState(false)



    const url = import.meta.env.VITE_BACKEND_URL

    const refreshToken = useCallback(
        async () => {
          try {
            const response = await fetch(`${url}/auth/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
      
            if (response.ok) {
              const data = await response.json();
              console.log('Access token refreshed:', data);
              setIsAuthenticated(true)
              return true;
            } else {
              console.error('Failed to refresh token');
              return false;
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
          }
        },
        [url]
      );
      
      const call_refresh = useCallback(
        async (status, func) => {
          if (status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
              return func();
            }
          }
          return null; 
        },
        [refreshToken]
      );
      
      useEffect(() => {
        const getAuthenticated = async () => {
          setIsLoadingAuth(true)
          try {
            const response = await fetch(`${url}/auth/isAuthenticated/`, {
              method: 'GET',
              credentials: 'include',
            });
      
            if (response.ok) {
              const data = await response.json();
              setIsAuthenticated(data.auth);
            } else {
              await call_refresh(response.status, getAuthenticated);
            }
          } catch (error) {
            await call_refresh(error, getAuthenticated);
          }finally{
            setIsLoadingAuth(false)
          }
        };
      
        getAuthenticated();
      }, [url, call_refresh]);


      let csrfToken = '';

      async function fetchCsrfToken() {
        try {
          const response = await fetch(`${url}/get-csrf-token/`, {
            credentials: 'include',
          });
          const data = await response.json();
          csrfToken = data.csrf_token;
          localStorage.setItem("csrf", csrfToken)
          return csrfToken;
        } catch (error) {
          console.error('Error fetching CSRF token:', error);
        }
      }

      fetchCsrfToken()

  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, isLoadingAuth}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider