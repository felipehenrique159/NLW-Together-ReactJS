import { createContext, ReactNode, useEffect, useState } from "react"
import { firebase, auth } from '../services/firebase'

type AuthContextType = {
    user: User | undefined
    signInWithGoogle: () => Promise<void>
}

type User = {
    id: string,
    name: string,
    avatar: string

}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
    
    const [user, setUser] = useState<User>()

    useEffect(() => {

        const unSubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user
                if (!displayName || !photoURL) {
                    throw new Error("Missing information from Google")
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            unSubscribe()
        }

    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        const res = await auth.signInWithPopup(provider)
    
        if (res.user) {
            const { displayName, photoURL, uid } = res.user
            if (!displayName || !photoURL) {
                throw new Error("Missing information from Google")
            }
    
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
    
        }
    
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}




