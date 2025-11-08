"use client";
import Navbar from "@/app/components/Navbar"

import {
  Users,        // Icono para Pacientes
  Stethoscope,  // Icono para Médicos
  Calendar,     // Icono para Citas
  FileText,     // Icono para Reportes
  Loader2, Download, AlertCircle, BarChart3, PieChartIcon, UserPlus, Activity
} from 'lucide-react';

import React, { useState } from 'react';
import { supabase } from "../../../../lib/supabaseClient"; // Asumiendo alias '@/'
import { useAuth } from "../../../context/AuthContext"; // Asumiendo alias '@/'

// Importar jsPDF para la generación de PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// Extender jsPDF con la función autoTable (tipado)
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

// --- Definición de Reportes ---
const reportesDisponibles = [
  { id: 1, nombre: 'Eficiencia: Citas por Especialidad', icon: Activity },
  { id: 2, nombre: 'Calidad: Tasa de Asistencia (Ausentismo)', icon: PieChartIcon },
  { id: 3, nombre: 'Crecimiento: Pacientes Nuevos por Mes', icon: UserPlus },
  { id: 4, nombre: 'Utilización: Pacientes Atendidos por Doctor', icon: Users },
  { id: 5, nombre: 'Demografía: Pacientes por Sexo', icon: BarChart3 },
];


// Columnas para cada reporte (para la tabla y el PDF)
const columnasPorReporte: { [key: number]: any[] } = {
  1: [
    { header: 'Especialidad', dataKey: 'categoria' },
    { header: 'Total de Citas', dataKey: 'total' },
  ],
  2: [
    { header: 'Estado de Asistencia', dataKey: 'categoria' },
    { header: 'Total', dataKey: 'total' },
    { header: 'Porcentaje (%)', dataKey: 'porcentaje' },
  ],
  3: [
    { header: 'Mes', dataKey: 'mes' },
    { header: 'Pacientes Nuevos', dataKey: 'total' },
  ],
  4: [
    { header: 'Doctor', dataKey: 'categoria' },
    { header: 'Pacientes Atendidos', dataKey: 'total' },
  ],
  5: [
    { header: 'Sexo', dataKey: 'categoria' },
    { header: 'Total de Pacientes', dataKey: 'total' },
  ],
};

const navLinks = [
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Médicos', href: '/admin/medicos', icon: Stethoscope },
    { name: 'Citas Médicas', href: '/admin/citas', icon: Calendar },
    { name: 'Reportes', href: '/admin/reportes', icon: FileText },
];

// Obtener fechas por defecto (mes actual)
const getFechasMesActual = () => {
  const ahora = new Date();
  const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split('T')[0];
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split('T')[0];
  return { inicio: primerDia, fin: ultimoDia };
};

const ReportesPage = () => {
  const { role } = useAuth();
  const [reporteId, setReporteId] = useState(reportesDisponibles[0].id);
  const [fechas, setFechas] = useState(getFechasMesActual());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos del reporte generado
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [reportColumns, setReportColumns] = useState<any[]>(columnasPorReporte[1]);
  const [reportTitle, setReportTitle] = useState(reportesDisponibles[0].nombre);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setFechas({ ...fechas, [e.target.name]: e.target.value });
  };

  // --- Lógica Principal: Generar Reporte ---
  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      if (!fechas.inicio || !fechas.fin) {
        throw new Error("Por favor, seleccione una fecha de inicio y fin.");
      }

      // 1. Llamar a la función "maestra" de Supabase
      const { data, error } = await supabase.rpc('generar_reporte_estrategico', {
        p_report_id: reporteId,
        p_fecha_inicio: fechas.inicio,
        p_fecha_fin: fechas.fin,
      });

      if (error) {
        throw error;
      }
      
      // 2. Guardar los datos y la configuración en el estado
      const titulo = reportesDisponibles.find(r => r.id === reporteId)?.nombre || "Reporte";
      setReportTitle(titulo);
      setReportData(data);
      setReportColumns(columnasPorReporte[reporteId]);

    } catch (err: any) {
      console.error("Error al generar reporte:", err.message);
      setError(`Error al generar reporte: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de PDF ---
  const generatePDF = () => {
    if (!reportData || !reportColumns || !reportTitle) return;

    const doc = new jsPDF();
    
    // Título del PDF
    doc.setFontSize(18);
    doc.text(reportTitle, 14, 22);
    
    // Subtítulo (Rango de Fechas)
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Desde ${fechas.inicio} hasta ${fechas.fin}`, 14, 29);

    // Generar la tabla automática
    autoTable(doc, {
      startY: 35,
      head: [reportColumns.map(col => col.header)], // Encabezados
      body: reportData.map(row => reportColumns.map(col => row[col.dataKey])), // Filas
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, // Color verde
    });

    // Guardar el archivo
    doc.save(`Reporte_${reportTitle.replace(/ /g, '_')}_${fechas.inicio}_${fechas.fin}.pdf`);
  };
  
  // Protección de ruta (deberías usar un Layout de Servidor para esto)
  if (role && role !== 'admin') {
     return <div className="p-8">Acceso denegado.</div>;
  }

  // Clases de Tailwind para inputs (para reutilizar)
  const labelClass = "block text-sm font-medium text-gray-700";
  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar navLinks={navLinks} principal="/admin"/>
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Generador de Reportes Estratégicos
          </h1>

          {/* --- Panel de Control --- */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              
              {/* 1. Selector de Reporte */}
              <div className="md:col-span-2">
                <label htmlFor="reporteId" className={labelClass}>Tipo de Reporte</label>
                <select 
                  id="reporteId"
                  value={reporteId}
                  onChange={(e) => setReporteId(Number(e.target.value))}
                  className={inputClass}
                >
                  {reportesDisponibles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>

              {/* 2. Fecha Inicio */}
              <div>
                <label htmlFor="inicio" className={labelClass}>Fecha Inicio</label>
                <input
                  type="date"
                  id="inicio"
                  name="inicio"
                  value={fechas.inicio}
                  onChange={handleDateChange}
                  className={inputClass}
                />
              </div>

              {/* 3. Fecha Fin */}
              <div>
                <label htmlFor="fin" className={labelClass}>Fecha Fin</label>
                <input
                  type="date"
                  id="fin"
                  name="fin"
                  value={fechas.fin}
                  onChange={handleDateChange}
                  className={inputClass}
                />
              </div>

            </div>
            
            {/* 4. Botón de Generar */}
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <BarChart3 className="mr-2 h-5 w-5" />
                )}
                Generar Reporte
              </button>
            </div>
            
            {/* Mensaje de Error */}
            {error && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-md bg-red-100 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* --- Área de Vista Previa del Reporte --- */}
          {reportData && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Vista Previa: {reportTitle}
                </h2>
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                >
                  <Download className="w-5 h-5" />
                  Descargar PDF
                </button>
              </div>

              {/* Tabla de Vista Previa */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {reportColumns.map((col) => (
                        <th key={col.dataKey} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.length === 0 ? (
                      <tr>
                        <td colSpan={reportColumns.length} className="px-6 py-4 text-center text-gray-500">
                          No se encontraron datos para este reporte en las fechas seleccionadas.
                        </td>
                      </tr>
                    ) : (
                      reportData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {reportColumns.map((col) => (
                            <td key={col.dataKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row[col.dataKey]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default ReportesPage