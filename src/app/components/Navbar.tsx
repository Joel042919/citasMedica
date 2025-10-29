// src/components/Header.tsx
'use client'

import { useAuth } from '@/context/AuthContext' // 1. Importa el hook
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function Header() {
  // 2. Consume el contexto
  const { session, role, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') // Redirige al login tras cerrar sesión
  }

  // 3. Muestra un "cargando..." mientras se verifica la sesión
  if (loading) {
    return <header>Cargando sesión...</header>
  }

  // 4. Renderiza basado en el rol y la sesión
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <Link href="/">
        <h1>Logo de la Clínica</h1>
      </Link>
      <nav>
        {session ? (
          <div>
            <span>Bienvenido, {session.user.email} (Rol: {role})</span>
            
            {/* Menús condicionales */}
            {role === 'paciente' && <Link href="/paciente/citas">Mis Citas</Link>}
            {role === 'medico' && <Link href="/doctor/agenda">Mi Agenda</Link>}

            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        ) : (
          <div>
            <Link href="/login">Iniciar Sesión</Link>
            <Link href="/registro">Registrarse</Link>
          </div>
        )}
      </nav>
    </header>
  )
}