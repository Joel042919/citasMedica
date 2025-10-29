// lib/server.ts (¡ACTUALIZADO!)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
// 1. ¡Importa 'cookies' directamente aquí!
import { cookies } from 'next/headers'

// 2. Ya no necesitas inferir el tipo 'CookieStore'
// type CookieStore = ReturnType<typeof cookies> // <--- BORRA ESTO

// 3. ¡Tu función 'createClient' ya NO recibe argumentos!
export const createClient = async () => {
  // 4. Llama a 'cookies()' DENTRO de la función
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El 'set' puede fallar en Server Components
            // Se puede ignorar si el middleware refresca la sesión.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // El 'delete' puede fallar en Server Components
            // Se puede ignorar.
          }
        },
      },
    }
  )
}