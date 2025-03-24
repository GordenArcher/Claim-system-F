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
import NewStaffClaim from "../pages/administrators/NewStaffClaim"
import { APIContext } from "../utils/context/APIContextProvider"
import Blocked from "../pages/Blocked"
import NavBar from "../layout/NavBar"
import MainAdminDashboard from "../pages/MainAdmin/MainAdminDashboard"
import AdminDashboard from "../pages/administrators/AdminDashboard"
import UserManagement from "../pages/administrators/UserManagement"

const PageRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const { user } = useContext(APIContext)

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  const role = user?.data?.role;

  if(user?.data?.has_access){
    return (
        <Routes>
            <Route path="/" element={<Blocked />} />
        </Routes>
    )
  }

  return (
    <>
        <NavBar />

        <Routes>
        {/* Common routes for all roles */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/staff/claim/verify" element={<ClaimVerification />} />
        <Route path="/claims/pending" element={<Pending_claims />} />
        <Route path="/claims/paid" element={<PaidClaims />} />
        <Route path="/settings" element={<Settings />} />

        {/* Routes for Administrators and Higher */}
        {(role === 'administrator' || role === 'main_administrator') && (
            <>
                <Route path="/payments/history" element={<PaymentHistory />} />
                <Route path="/staff/claim/new" element={<NewStaffClaim />} />
                <Route path="/claims/history" element={<HistoryClaims />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/user-management" element={<UserManagement />} />
            </>
        )}

        {/* Routes for Main Administrators Only */}
        {role === 'main_administrator' && (
            <>
                <Route path="main-admin/dashboard" element={<MainAdminDashboard />} />
            </>
        )}

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </>
    
  )
}

export default PageRoutes
