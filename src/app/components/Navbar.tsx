"use client"
import { handleOut } from "@/auth/login";
import {useAuth} from "../../context/AuthContext";
import {
  Hospital,     // Icono para el logo
  Users,        // Icono para Pacientes
  Stethoscope,  // Icono para Médicos
  Calendar,     // Icono para Citas
  FileText,     // Icono para Reportes
  Settings,     // Icono para Configurar
  LogOut,       // Icono para Salir
  Menu,         // Icono de Hamburguesa
  X,            // Icono de Cerrar
  UserCircle,   // Icono para el usuario
  Loader2       // Icono de Carga
} from 'lucide-react';
import { useState } from "react";

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavbarProps {
  navLinks: NavLink[];
  principal: string;
}

const Navbar = ({ navLinks, principal }: NavbarProps) => {
  const { user, role, loading } = useAuth();
  
  // Estado para controlar el menú responsive en móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado para controlar el menú desplegable del usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  /**
   * Componente interno para renderizar la sección del usuario.
   * Maneja los estados de carga, logueado y no logueado.
   */
  const UserSection = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-3 h-20">
          {/* Un ícono de carga giratorio */}
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="relative">
          {/* --- Botón para abrir el menú de usuario --- */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 transition-colors"
          >
            <UserCircle className="w-10 h-10 flex-shrink-0" />
            <div className="truncate min-w-0">
              <p className="font-semibold text-sm truncate">{user.email}</p>
              <p className="text-xs text-indigo-100 capitalize">{role || 'Usuario'}</p>
            </div>
          </button>

          {/* --- Menú desplegable del usuario --- */}
          {/* Aparece "hacia arriba" (drop-up) porque está al final del sidebar */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-30">
              <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
                <span>Configurar</span>
              </a>
              <button
                onClick={() => {
                  handleOut(); // Ejecuta el logout
                  setIsUserMenuOpen(false); // Cierra el menú
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    // --- Estado si no está logueado ---
    return (
      <div className="p-3 bg-indigo-500 rounded-lg">
        <p className="text-sm">Por favor, inicia sesión</p>
      </div>
    );
  };

  return (
    <>
      {/* --- 1. BARRA SUPERIOR MÓVIL (Visible solo en < md) --- */}
      <header className="bg-indigo-400 text-white p-4 flex justify-between items-center md:hidden relative z-20 shadow-md">
        {/* Logo y Nombre en Móvil */}
        <div className="flex items-center gap-2">
          <Hospital className="w-8 h-8" />
          <a href={principal} className="text-xl font-bold">Aquí Te Curas</a>
        </div>
        
        {/* Botón de Hamburguesa */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
        >
          <span className="sr-only">Abrir menú</span>
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </header>

      {/* --- 2. SIDEBAR (Escritorio) / MENÚ DESLIZABLE (Móvil) --- */}
      <aside
        className={`
          bg-indigo-400 text-white
          flex flex-col
          p-6
          fixed md:sticky         {/* Fijo en móvil (para deslizar), estático en escritorio */}
          inset-y-0 left-0        {/* Ocupa toda la altura */}
          w-64 md:w-64            {/* Ancho fijo */}
          h-screen md:h-screen    {/* Altura de pantalla */}
          transition-transform duration-300 ease-in-out
          z-10 md:z-auto          {/* z-10 en móvil para superponerse, auto en escritorio */}
          shadow-xl md:shadow-lg  {/* Sombra para el menú móvil */}
          
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* --- Logo y Botón de Cerrar (Visible en el menú móvil) --- */}
        <div className="flex justify-between items-center md:hidden mb-6">
           <div className="flex items-center gap-2">
             <Hospital className="w-8 h-8" />
             <span className="text-xl font-bold">Aquí Te Curas</span>
           </div>
           <button 
             onClick={() => setIsMobileMenuOpen(false)}
             className="p-1 rounded-md hover:bg-indigo-500"
           >
             <span className="sr-only">Cerrar menú</span>
             <X className="w-7 h-7" />
           </button>
        </div>

        {/* --- Logo (Visible solo en Escritorio) --- */}
        <div className="hidden md:flex items-center gap-3 mb-8">
          <Hospital className="w-10 h-10" />
          <a href="/admin" className="text-2xl font-bold">Aquí Te Curas</a>
        </div>

        {/* --- Enlaces de Navegación --- */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* --- Sección del Usuario (al final) --- */}
        <div className="mt-auto">
          <UserSection />
        </div>
      </aside>

      {/* --- 3. OVERLAY (Fondo oscuro en móvil al abrir el menú) --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;