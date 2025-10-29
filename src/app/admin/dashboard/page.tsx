// src/app/admin/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { supabase } from '../../../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

// Registrar elementos de chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

// Interfaz para los datos del Dashboard
interface DoctorMetrics {
  nombre_medico: string;
  conteo_atenciones: number;
  promedio_minutos_programados: number;
}

interface SpecialtyMetrics {
  especialidad: string;
  estado_cita: string;
  conteo: number;
}

const DashboardPage = () => {
  const [doctorMetrics, setDoctorMetrics] = useState<DoctorMetrics[]>([]);
  const [specialtyMetrics, setSpecialtyMetrics] = useState<SpecialtyMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: doctorData, error: doctorError } = await supabase
        .rpc('get_dashboard_metricas_por_doctor');
      
      if (doctorError) throw new Error(doctorError.message);
      setDoctorMetrics(doctorData || []);

      const { data: specialtyData, error: specialtyError } = await supabase
        .rpc('get_dashboard_atenciones_por_especialidad');
      
      if (specialtyError) throw new Error(specialtyError.message);
      setSpecialtyMetrics(specialtyData || []);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('Error al cargar los datos del dashboard. Por favor, intente de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Datos para el gráfico de barras
  const barChartData = {
    labels: doctorMetrics.map((doc) => doc.nombre_medico),
    datasets: [
      {
        label: 'Atenciones',
        data: doctorMetrics.map((doc) => doc.conteo_atenciones),
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Promedio Minutos',
        data: doctorMetrics.map((doc) => doc.promedio_minutos_programados),
        backgroundColor: 'rgba(167, 139, 250, 0.7)',
        borderColor: 'rgba(167, 139, 250, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Datos para el gráfico de dona
  const appointmentStatusData = {
    labels: Array.from(new Set(specialtyMetrics.map(item => item.estado_cita))),
    datasets: [
      {
        data: Array.from(new Set(specialtyMetrics.map(item => item.estado_cita))).map(
          status => specialtyMetrics
            .filter(item => item.estado_cita === status)
            .reduce((sum, item) => sum + item.conteo, 0)
        ),
        backgroundColor: [
          'rgba(124, 58, 237, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(124, 58, 237, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calcular total de citas
  const totalAppointments = specialtyMetrics.reduce((sum, item) => sum + item.conteo, 0);

  // Obtener el top 5 de especialidades
  const topSpecialties = Array.from(
    new Set(specialtyMetrics.map(item => item.especialidad))
  ).map(especialidad => ({
    especialidad,
    total: specialtyMetrics
      .filter(item => item.especialidad === especialidad)
      .reduce((sum, item) => sum + item.conteo, 0)
  })).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Panel de Control</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={getDashboardData}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Citas</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalAppointments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Citas Completadas</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {specialtyMetrics
                        .filter(item => item.estado_cita === 'COMPLETADA')
                        .reduce((sum, item) => sum + item.conteo, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Próximas Citas</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {specialtyMetrics
                        .filter(item => item.estado_cita === 'PROGRAMADA' || item.estado_cita === 'CONFIRMADA')
                        .reduce((sum, item) => sum + item.conteo, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio Duración</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {doctorMetrics.length > 0 
                        ? Math.round(doctorMetrics.reduce((sum, doc) => sum + doc.promedio_minutos_programados, 0) / doctorMetrics.length)
                        : 0
                      } min
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de barras */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Atenciones por Médico</h2>
                <div className="h-80">
                  <Bar 
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: '#6B7280',
                          }
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 13 },
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                if (context.datasetIndex === 1) {
                                  label += ' min';
                                }
                              }
                              return label;
                            }
                          }
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: '#6B7280',
                          }
                        },
                        y: {
                          grid: {
                            color: '#E5E7EB'
                          },
                          ticks: {
                            color: '#6B7280',
                            callback: function(value) {
                              if (typeof value === 'number') {
                                return value % 1 === 0 ? value : '';
                              }
                              return value;
                            }
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Gráfico de dona */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado de Citas</h2>
                <div className="h-80 flex items-center justify-center">
                  <div className="w-64 h-64">
                    <Doughnut 
                      data={appointmentStatusData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              color: '#6B7280',
                              padding: 20,
                              font: {
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.raw as number;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        },
                        cutout: '70%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabla de especialidades */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Especialidades</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Especialidad
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Citas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Porcentaje
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Progreso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {topSpecialties.map((specialty) => {
                      const percentage = totalAppointments > 0 
                        ? Math.round((specialty.total / totalAppointments) * 100) 
                        : 0;
                      
                      return (
                        <tr key={specialty.especialidad} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {specialty.especialidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {specialty.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-purple-300 h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;