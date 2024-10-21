import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const {children} = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logOut() {
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    const value = { globalUser, globalData, setGlobalData, isLoading, signUp, logIn, logOut }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // If there's no user, empty the user state and return from this listener
            setGlobalUser(user)
            if (!user) {
                console.log("No Active User")
                return
            }
            // If there is a user, then check if the user has data in the database, if they do, then fetch said data and update the global state
            try {
                setIsLoading(true)

                // First we create a reference for the document (labelled json object), and then we get the doc, and then we snapshot it to see if there's anything there
                const docRef = doc(db, "users", user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = []
                if (docSnap.exists()) {
                    firebaseData = docSnap.data()
                    console.log("Found user data", firebaseData)
                }
                setGlobalData(firebaseData)
            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        })

        return unsubscribe
    }, [])

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}