// src/app/admin/citas/page.tsx
'use client';

import Navbar from '@/app/components/Navbar';
import { useState } from 'react';

import { FiCalendar, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

export default function CitasPage() {
  const [activeTab, setActiveTab] = useState('todas');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Citas</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Administra y programa las citas médicas de los pacientes
            </p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Nueva Cita
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Buscar citas..."
              />
            </div>
            <div className="flex items-center">
              <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="todas">Todas las citas</option>
                <option value="hoy">Hoy</option>
                <option value="pendientes">Pendientes</option>
                <option value="completadas">Completadas</option>
                <option value="canceladas">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Lista de Citas
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No hay citas programadas para mostrar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}