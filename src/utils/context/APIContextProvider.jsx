import { createContext, useEffect, useState } from "react"
import Get_pending_claims from "../../api/Get_pending_claims"
import Get_all_claims from "../../api/Get_all_claims"
import Get_paid_claims from "../../api/Get_paid_claims"
import Get_Payment_History from "../../api/Get_Payment_History"
import Get_User from "../../api/Get_User"
import Get_all_users from "../../api/Get_all_users"
import Get_recent_claims from "../../api/Get_recent_claims"
import Get_report_summery from "../../api/Get_Summery"
import Get_audit from "../../api/Get_auditTrials"


export const APIContext = createContext()

const APIContextProvider = ({children}) => {
  const [user, setUser] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [pendingClaims, setPendingClaims] = useState([])
  const [claimsHistory, setClaimsHistory] = useState([])
  const [RecentClaims, setRecentClaims] = useState([])
  const [paidClaims, setPaidClaims] = useState([])
  const [payHistory, setPayHistory] = useState([])
  const [reportSummery, setReportSummery] = useState([])
  const [auditTrails, setAuditTrails] = useState([])
  

  const { userData } = Get_User()
  const { data } = Get_pending_claims()
  const { allClaims } = Get_all_claims()
  const { recentClaims } = Get_recent_claims()
  const { paidData } = Get_paid_claims()
  const { paymentHistory } = Get_Payment_History()
  const { users, isGettingUsers } = Get_all_users()
  const { summeryReports } = Get_report_summery()
  const { allAudit } = Get_audit()
  

  useEffect(() => {
    setPendingClaims(data)
    setClaimsHistory(allClaims)
    setRecentClaims(recentClaims)
    setPaidClaims(paidData)
    setPayHistory(paymentHistory)
    setUser(userData)
    setAllUsers(users)
    setReportSummery(summeryReports)
    setAuditTrails(allAudit)
  }, [data, allClaims, paidData, paymentHistory, userData, users, recentClaims, summeryReports, allAudit])


  return (
    <APIContext.Provider value={{setPendingClaims, 
    pendingClaims, 
    claimsHistory, 
    RecentClaims,
    paidClaims, 
    payHistory,
    user,
    allUsers,
    setAllUsers,
    isGettingUsers,
    reportSummery,
    auditTrails
    }}>
      {children}
    </APIContext.Provider>
  )
}

export default APIContextProvider