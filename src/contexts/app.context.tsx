import React, { createContext, useState } from "react"
import { ProfileUser, User } from "../types/user.type"
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth"
// import { useSelector, useDispatch } from 'react-redux'
// import { RootState } from "../redux/store"

interface AppContextInterface{
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    profile: ProfileUser | null
    setProfile: React.Dispatch<React.SetStateAction<ProfileUser | null>>
}
const initialAppContext : AppContextInterface = {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)
export const AppProvider = ({children} : {children: React.ReactNode}) => {
    // const auth = useSelector((state: RootState) => state.auth)
    // console.log('auth', auth);
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
    const [profile, setProfile] = useState<ProfileUser | null>(initialAppContext.profile)

    return(
        <AppContext.Provider 
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile, 
                setProfile
            }}
        >
            {children}
        </AppContext.Provider>
    )
}