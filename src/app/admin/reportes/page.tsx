// src/app/admin/reportes/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { FiPieChart, FiDownload } from 'react-icons/fi';

export default function ReportesPage() {
  const [selectedReport, setSelectedReport] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reportes</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Genera y visualiza reportes del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Reporte de Citas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-md p-3">
                  <FiPieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Reporte de Citas
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        Generar reporte
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
              <div className="text-sm">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  <FiDownload className="mr-1.5 h-5 w-5" />
                  Descargar
                </button>
              </div>
            </div>
          </div>

          {/* Reporte de Ingresos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                  <FiPieChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Reporte de Ingresos
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        Generar reporte
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
              <div className="text-sm">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  <FiDownload className="mr-1.5 h-5 w-5" />
                  Descargar
                </button>
              </div>
            </div>
          </div>

          {/* Reporte de Pacientes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-md p-3">
                  <FiPieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Reporte de Pacientes
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        Generar reporte
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
              <div className="text-sm">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FiDownload className="mr-1.5 h-5 w-5" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}   