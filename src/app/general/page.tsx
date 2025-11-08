"use client";

import { useAuth } from '@/context/AuthContext';
// import { div } from 'framer-motion/client'; // No se usaba
// import { redirect } from 'next/navigation'; // No se usaba, router.replace es correcto
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Building2, HeartPulse } from 'lucide-react'; // Importamos los íconos

const Triage = () => {
  const {role, loading} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(loading){
      return // No hagas nada mientras sigue cargando
    }

    // Una vez que 'loading' es false, redirige
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
      // Caso por defecto si el rol no es reconocido
      router.replace('/login') 
    }
  }, [role, loading, router])

  // El componente siempre renderizará la pantalla de carga.
  // El useEffect se encargará de la redirección cuando 'loading' sea false.
  return (
    <>
      {/* Definimos las animaciones directamente en el CSS.
        Next.js con 'use client' permite la etiqueta <style>
      */}
      <style jsx global>{`
        @keyframes build-up {
          /* La base del edificio sube desde abajo */
          0% { 
            transform: scaleY(0); 
            opacity: 0; 
          }
          100% { 
            transform: scaleY(1); 
            opacity: 1; 
          }
        }
        @keyframes fade-in-pulse {
          /* El corazón aparece y da un primer pulso */
          0% { 
            opacity: 0; 
            transform: scale(0.5); 
          }
          70% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        @keyframes pulse-heart {
          /* El corazón late continuamente */
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.15); 
          }
        }
      `}</style>

      {/* Pantalla de carga centrada */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        
        {/* Contenedor de la animación */}
        <div className="relative w-32 h-32 mb-6">
          
          {/* El Edificio (Hospital) */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              transformOrigin: 'bottom',
              animation: 'build-up 1s ease-out forwards', // Aplica animación 'build-up'
            }}
          >
            <Building2 className="w-28 h-28 text-gray-300" />
          </div>
          
          {/* El Corazón (Pulso) */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2"
            style={{
              opacity: 0, // Empieza oculto
              // Aplica 'fade-in-pulse' una vez, luego 'pulse-heart' infinitamente
              animation: 'fade-in-pulse 0.8s ease-out 0.8s forwards, pulse-heart 1.5s infinite 1.8s',
            }}
          >
            <HeartPulse className="w-14 h-14 text-red-500" />
          </div>
        </div>
        
        {/* Texto de carga */}
        <h1 className="text-xl font-semibold animate-pulse">
          Cargando tu dashboard...
        </h1>
      </div>
    </>
  )
}

export default Triage;