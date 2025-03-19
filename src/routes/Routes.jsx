import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Dashboard from "../pages/accountants/Dashboard"
import ClaimVerification from "../pages/accountants/verify_Staff_Claim"
import { useContext } from "react"
import { AuthContext } from "../utils/context/AuthContextProvider"
import Pending_claims from "../pages/accountants/Pending_claims"
import HistoryClaims from "../pages/accountants/HistoryClaims"
import PaidClaims from "../pages/accountants/PaidClaims"
import Settings from "../pages/accountants/Settings"
import PaymentHistory from "../pages/accountants/PaymentHistory"
import NewStaffClaim from "../pages/staff/NewStaffClaim"
import { APIContext } from "../utils/context/APIContextProvider"

const PageRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const { user } = useContext(APIContext)

  return (
    <>
        <Routes>
            {isAuthenticated ?
                (user.data?.role === 'accountant' ? (
                    <>
                        {/* These routes are for the Accountant */}
                        <Route path="/" element={ <Dashboard /> } />
                        <Route path="/staff/claim/verify" element={ <ClaimVerification /> } />
                        <Route path="/claims/pending" element={ <Pending_claims /> } />
                        <Route path="/claims/history" element={ <HistoryClaims /> } />
                        <Route path="/claims/paid" element={ <PaidClaims /> } />
                        <Route path="/payments/history" element={ <PaymentHistory /> } />
                        <Route path="/settings" element={ <Settings /> } />
                        <Route path="*" element={ <Navigate to={'/'} /> } />
                    </>
                ) : (
                    <>
                        {/* These routes are for the Staff */}
                        <Route path="/" element={ <NewStaffClaim /> } />
                        <Route path="*" element={ <Navigate to={'/'} /> } />
                    </>
                ))
            :
            <>
                <Route path="/" element={ <Login /> } />
                <Route path="/auth/register/" element={ <Register /> } />
                <Route path="*" element={ <Navigate to={'/'} />} />
            </>
        }
            
        </Routes>
    </>
  )
}

export default PageRoutes