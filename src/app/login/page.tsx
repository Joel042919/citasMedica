"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, Variants, Transition } from "framer-motion"
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiAlertCircle } from "react-icons/fi"
import { getUserRole, handleLogin } from "../../auth/login"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
}

const buttonVariants: Variants = {
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.25)"
  },
  loading: {
    scale: 0.98,
    opacity: 0.8
  }
}

const inputFocus = {
  scale: 1.02,
  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
  transition: { duration: 0.2 }
}

const inputHover = {
  scale: 1.01,
  boxShadow: "0 2px 10px -3px rgba(0, 0, 0, 0.1)",
  transition: { duration: 0.2 }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const validateForm = () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresa un correo electrónico válido')
      return false
    }
    if (!password) {
      setError('Por favor ingresa tu contraseña')
      return false
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    return true
  }

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!isMounted) return // Evitar actualización de estado si el componente se desmontó
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const loginResult = await handleLogin(email, password)

      if (!isMounted) return // Verificar nuevamente después de la llamada asíncrona

      if (loginResult.error || !loginResult.user) {
        setError(loginResult.error || 'Error al iniciar sesión. Verifica tus credenciales.')
        return
      }

      const role:string|null = await getUserRole(loginResult.user.id)
      
      if (!isMounted) return // Verificar una última vez antes de la navegación
      
      // Animate before navigation
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const redirectPath = {
        'paciente': '/paciente/home',
        'medico': '/doctor/home',
        'administrador': '/admin/dashboard'
      }[role as string] || '/'
      
      router.push(redirectPath)
      router.refresh()
    } catch (error) {
      console.error("Error en login:", error)
      if (isMounted) {
        setError('Ocurrió un error al iniciar sesión. Por favor, verifica tu conexión e inténtalo de nuevo.')
      }
    } finally {
      if (isMounted) {
        setIsLoading(false)
      }
    }
  }

  if (!isMounted) return null

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Bienvenido
          </motion.h1>
          <motion.p 
            className="text-blue-100 mt-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Inicia sesión para continuar
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.div 
          className="p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onLoginSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <motion.div 
                className="relative mt-1 rounded-md shadow-sm text-zinc-900"
                whileHover={inputHover}
                whileFocus={inputFocus}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-zinc-900" />
                </div>
                <input
                  style={{ color: 'black', paddingLeft: '40px' }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg transition-all duration-200 text-zinc-900"
                  placeholder="tu@correo.com"
                  disabled={isLoading}
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <motion.div 
                className="relative mt-1 rounded-md shadow-sm"
                whileHover={inputHover}
                whileFocus={inputFocus}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-zinc-900" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  style={{ color: 'black', paddingLeft: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg transition-all duration-200 text-zinc-900"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-zinc-900 hover:text-gray-500 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-zinc-900 hover:text-gray-500 transition-colors" />
                  )}
                </button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
                onChange={(e) => {
                  // Implementar lógica de "Recordar sesión" aquí
                  if (e.target.checked) {
                    // Guardar en localStorage o cookies
                    localStorage.setItem('rememberMe', 'true')
                  } else {
                    localStorage.removeItem('rememberMe')
                  }
                }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Recordar mi sesión
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-80' : ''}`}
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : "loading"}
                whileTap={!isLoading ? "tap" : "loading"}
                animate={isLoading ? "loading" : "visible"}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-5 w-5 text-white" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2 h-5 w-5 text-blue-200 group-hover:text-white transition-colors" />
                    Iniciar Sesión
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-8 pt-6 border-t border-gray-200 text-center"
            variants={itemVariants}
          >
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Regístrate
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}