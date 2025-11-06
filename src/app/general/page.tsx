"use client";

import { useAuth } from '@/context/AuthContext';
import { div } from 'framer-motion/client';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const Triage = () => {
  const {role,loading} = useAuth()

  const router = useRouter()

  useEffect(() => {
    if(loading){
      return
    }

    if(!role){
      router.replace('/login')
    }
    
    if(role==='admin'){
      router.replace('/admin')
    }else if(role==='doctor'){
      router.replace('/doctor')
    }else if(role==='paciente'){
      router.replace('/paciente')
    }else{
      redirect('/login')
    }
  }, [role,loading,router])

  return <div>Cargando tu dashboard.....</div>
}

export default Triage

