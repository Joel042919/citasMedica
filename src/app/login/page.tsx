"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getUserRole, handleLogin } from "../../auth/login"





export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const onLoginSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()

        setError(null)

        const loginResult = await handleLogin(email, password)

        if(loginResult.error || !loginResult.user){
            setError(loginResult.error || 'Error desconocido')
            console.log("Error en login:", loginResult.error)
            return
        }

        console.log("Usuario logueado:", loginResult.user)
        const role = await getUserRole(loginResult.user.id)


        console.log("Rol del usuario:", role);
        if (role === 'paciente') {
            router.push('/paciente/home') // Llévalo al home de paciente
            router.refresh();
        } else if (role === 'medico') {
            router.push('/doctor/home') // Llévalo al home de doctor
            router.refresh();
        } else if (role === 'administrador') {
            router.push('/admin/dashboard') // Llévalo al dashboard admin
            router.refresh();
        }
    }


    return(
        <form onSubmit={onLoginSubmit}>
            <h2>Iniciar Sesión</h2>
            <div>
                <label htmlFor="email">EMAIL</label>
                <input type="email" className="bg-zinc-800" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">PASSWORD</label>
                <input type="password" className="bg-zinc-800" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <button type="submit">Ingresar</button>
            {error && <p style={{color:'red'}}>{error}</p>}
        </form>
    )
}