'use client'


import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";


interface AuthContextType{
    user: any | null;
    role: string | null;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        setLoading(true);
        const {data: authListener} = supabase.auth.onAuthStateChange(
            async (event, session) =>{
                if(session?.user){
                    const {data:profile, error} = await supabase.from('perfiles').select('rol').eq('id',session.user.id).single();

                    if(error){
                        console.error("Error al obtener el perfil", error.message);
                    }

                    setUser(session.user);
                    setRole(profile?.rol || null);  
                }else{
                    setUser(null);
                    setRole(null);
                }
                setLoading(false);
            }
        )

        return ()=>{
            authListener?.subscription.unsubscribe();
        }
    },[])

    const value = {
        user,
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
