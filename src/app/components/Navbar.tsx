// src/app/components/Navbar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiBell, FiSettings, FiLogOut, FiHome, FiUsers, FiCalendar, FiPieChart, FiPlusCircle } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Citas', href: '/admin/citas', icon: <FiCalendar className="w-5 h-5" /> },
    { name: 'Médicos', href: '/admin/medicos', icon: <FiUser className="w-5 h-5" /> },
    { name: 'Pacientes', href: '/admin/pacientes', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Reportes', href: '/admin/reportes', icon: <FiPieChart className="w-5 h-5" /> },
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  CitasMed
                </span>
              </Link>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === item.href
                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right side items */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                <FiBell className="h-5 w-5" />
              </button>
              
              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Admin
                    </span>
                  </button>
                </div>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1" role="none">
                      <Link
                        href="/admin/perfil"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <FiUser className="inline mr-2" />
                        Perfil
                      </Link>
                      <Link
                        href="/admin/configuracion"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <FiSettings className="inline mr-2" />
                        Configuración
                      </Link>
                      <button
                        onClick={() => {
                                handleLogout();
                                setIsProfileOpen(false);
                              }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <FiLogOut className="inline mr-2" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Abrir menú principal</span>
                {isOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">Admin</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">admin@citasmed.com</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/admin/perfil"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="inline mr-2" />
                  Perfil
                </Link>
                <Link
                  href="/admin/configuracion"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <FiSettings className="inline mr-2" />
                  Configuración
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <FiLogOut className="inline mr-2" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Add padding to account for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;