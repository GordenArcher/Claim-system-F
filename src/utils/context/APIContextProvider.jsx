import { createContext, useEffect, useMemo, useState } from "react"
import Get_pending_claims from "../../api/Get_pending_claims"
import Get_all_claims from "../../api/Get_all_claims"
import Get_Payment_History from "../../api/Get_Payment_History"
import Get_User from "../../api/Get_User"
import Get_all_users from "../../api/Get_all_users"
import Get_recent_claims from "../../api/Get_recent_claims"
import Get_report_summery from "../../api/Get_Summery"
import Get_audit from "../../api/Get_auditTrials"
import { Get_users_logs } from "../../api/Get_staff_logs"
import { Get_Claim_Status } from "../../api/Get_staff_processes"

export const APIContext = createContext()

const APIContextProvider = ({ children }) => {
  const [user, setUser] = useState([]) 
  const [allUsers, setAllUsers] = useState([])
  const [pendingClaims, setPendingClaims] = useState([])
  const [claimsHistory, setclaimsHistory] = useState([])
  const [claimStatusData, setClaimStatusData] = useState([])

  const { userData, isLoadingUser } = Get_User()
  const { data: pendingData } = Get_pending_claims()
  const { allClaims,  } = Get_all_claims()
  const { recentClaims } = Get_recent_claims()
  const { paymentHistory} = Get_Payment_History()
  const { users, isGettingUsers } = Get_all_users()
  const { summeryReports } = Get_report_summery()
  const { allAudit } = Get_audit()
  const { systemLogs } = Get_users_logs()
  const { claimStatus} = Get_Claim_Status()

  useEffect(() => {
    if (pendingData) setPendingClaims(pendingData)
    if (userData) setUser(userData)
    if (users) setAllUsers(users)
    if (claimStatus) setClaimStatusData(claimStatus)
    if (allClaims) setclaimsHistory(allClaims)
  }, [pendingData, userData, users, claimStatus, allClaims])

  const contextValue = useMemo(() => ({
    pendingClaims,
    setPendingClaims,
    claimsHistory,
    setclaimsHistory,
    RecentClaims: recentClaims || [],
    payHistory: paymentHistory || [],
    user,
    setUser,
    isLoadingUser,
    allUsers,
    setAllUsers,
    isGettingUsers,
    reportSummery: summeryReports || [],
    auditTrails: allAudit || [],
    logsSystem: systemLogs || [],
    claimStatusData,
  }), [
    pendingClaims, claimsHistory, recentClaims, paymentHistory,
    user, isLoadingUser, allUsers, isGettingUsers,
    summeryReports, allAudit, systemLogs, claimStatusData
  ])

  return (
    <APIContext.Provider value={contextValue}>
      {children}
    </APIContext.Provider>
  )
}

export default APIContextProvider
