// src/app/admin/medicos/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { FiUser, FiPlus, FiSearch } from 'react-icons/fi';

export default function MedicosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Médicos</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Administra la información de los médicos
            </p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Nuevo Médico
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Lista de Médicos
            </h3>
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Buscar médicos..."
              />
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No hay médicos registrados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}