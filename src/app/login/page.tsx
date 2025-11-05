"use client"

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient';
import Navbar from '../components/Navbar';

const page = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {data,error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    
    if(error){
      console.error("Error al iniciar sesión", error.message)
    }else{
      console.log("Sesión iniciada correctamente", data)
      
    }
  }


  const confirmation = async() =>{
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/admin/dashboard'
      }
    })
    
    if(error){
      console.error("Error al confirmar", error.message)
    }else{
      console.log("Confirmación enviada correctamente")
    }
  }

  
  return (
    <div>
      <Navbar/>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" placeholder="Contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="bg-emerald-600 p-4 rounded-2xl cursor-pointer" type="submit">Iniciar sesión</button>
        <button onClick={confirmation}>Confirmar</button>
      </form>
    </div>
  )
}

export default page