'use client'

import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, use, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getUserRole } from "@/auth/login";


interface AuthContextType{
    session: Session | null;
    role: string | null;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}){
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const fetchSessionAndRole = async ()=>{
            const { data: { session } } = await supabase.auth.getSession();

            setSession(session);

            if(session){
                const userRole = await getUserRole(session.user.id);
                setRole(userRole);
            }

            setLoading(false);
        }
        fetchSessionAndRole();

        const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session)=>{
            setLoading(true);
            setSession(session);

            let userRole : string | null = null;
            if(session){
                userRole = await getUserRole(session.user.id);
            }

            setRole(userRole);
            setLoading(false);
        })

        return ()=>{
            authListener.subscription.unsubscribe();
        }
    },[])

    const value = {
        session,
        role,
        loading,
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
}
