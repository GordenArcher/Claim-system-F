import { createContext, useEffect, useState } from "react"
import Get_pending_claims from "../../api/Get_pending_claims"
import Get_all_claims from "../../api/Get_all_claims"
import Get_paid_claims from "../../api/Get_paid_claims"
import Get_Payment_History from "../../api/Get_Payment_History"
import Get_User from "../../api/Get_User"


export const APIContext = createContext()

const APIContextProvider = ({children}) => {

  const [pendingClaims, setPendingClaims] = useState([])
  const [claimsHistory, setClaimsHistory] = useState([])
  const [paidClaims, setPaidClaims] = useState([])
  const [payHistory, setPayHistory] = useState([])
  const [user, setUser] = useState([])


  const { data } = Get_pending_claims()
  const { allClaims } = Get_all_claims()
  const { paidData } = Get_paid_claims()
  const { paymentHistory } = Get_Payment_History()
  const { userData } = Get_User()
  

  useEffect(() => {
    setPendingClaims(data)
    setClaimsHistory(allClaims)
    setPaidClaims(paidData)
    setPayHistory(paymentHistory)
    setUser(userData)
  }, [data, allClaims, paidData, paymentHistory, userData])


  return (
    <APIContext.Provider value={{setPendingClaims, 
    pendingClaims, 
    claimsHistory, 
    paidClaims, 
    payHistory,
    user,
    }}>
      {children}
    </APIContext.Provider>
  )
}

export default APIContextProvider