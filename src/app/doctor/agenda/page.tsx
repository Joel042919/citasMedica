"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from "../../../../lib/supabaseClient"; // Ajusta tu ruta
import { useAuth } from "../../../context/AuthContext"; // Ajusta tu ruta
// Asumiré que tienes un Navbar en esta ruta
import Navbar from "../../components/Navbar"; 

import {
  Users,
  Stethoscope,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  Video,
  User,
} from 'lucide-react';

// --- Tipos de Datos ---
interface Cita {
  idCita: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  linkCita?: string;
  pacienteNombre: string;
  pacienteApellido: string;
}

interface Horario {
  diaSemana: string; // "Lunes", "Martes", etc.
  horaInicio: string;
  horaFin: string;
}

interface AgendaData {
  citas: Cita[];
  horario: Horario[];
}

// --- Constantes del Calendario ---
const DIAS_SEMANA_MAP: { [key: string]: number } = {
  'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3,
  'jueves': 4, 'viernes': 5, 'sábado': 6
};
const HORA_INICIO_CALENDARIO = 7; // 7 AM
const HORA_FIN_CALENDARIO = 20; // 8 PM (20:00)
const ALTURA_HORA_PX = 60; // 60px por hora

// --- Funciones de Ayuda de Fechas ---

/** Obtiene el primer día (Lunes) de la semana de una fecha dada */
const getInicioSemana = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que Lunes sea el primer día
  return new Date(d.setDate(diff));
};

/** Genera los 7 días de la semana a partir del Lunes */
const getDiasDeLaSemana = (inicioSemana: Date): Date[] => {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + i);
    return d;
  });
};

/** Formatea una fecha como "VIE 7" */
const formatCabeceraDia = (date: Date): { dia: string, num: number } => {
  const dia = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
  const num = date.getDate();
  return { dia, num };
};

/** Comprueba si dos fechas son el mismo día */
const isMismoDia = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/** Convierte una hora "HH:mm:ss" a minutos desde la medianoche */
const horaAMinutos = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};


// --- Componente Principal de la Agenda ---
const AgendaDoctorPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendaData, setAgendaData] = useState<AgendaData>({ citas: [], horario: [] });
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  // Derivar estado de la fecha actual
  const inicioSemana = useMemo(() => getInicioSemana(currentDate), [currentDate]);
  const diasSemana = useMemo(() => getDiasDeLaSemana(inicioSemana), [inicioSemana]);
  const hoy = new Date();

  // --- Carga de Datos ---
  useEffect(() => {
    if (authLoading) return;
    if (!user || role !== 'doctor') {
      setLoading(false);
      setError("Acceso denegado. Debe ser un doctor.");
      return;
    }

    const fetchAgenda = async () => {
      setLoading(true);
      setError(null);
      
      const inicioSemanaISO = inicioSemana.toISOString().split('T')[0];

      try {
        const { data, error } = await supabase.rpc('get_doctor_agenda', {
          p_doctor_id: user.id,
          p_start_date: inicioSemanaISO,
        });

        if (error) throw error;
        setAgendaData(data as AgendaData);

      } catch (err: any) {
        console.error("Error al cargar la agenda:", err);
        setError(err.message || "No se pudo cargar la agenda.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [user, role, authLoading, inicioSemana]);

  // --- Manejadores de Eventos ---
  const irSemanaAnterior = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const irSemanaSiguiente = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  const irHoy = () => {
    setCurrentDate(new Date());
  };

  // --- Renderizado de Horas (Columna Izquierda) ---
  const renderizarHoras = () => {
    const horas = [];
    for (let h = HORA_INICIO_CALENDARIO; h < HORA_FIN_CALENDARIO; h++) {
      horas.push(
        <div key={h} className="h-full flex justify-end items-start pt-1 pr-2" style={{ height: `${ALTURA_HORA_PX}px` }}>
          <span className="text-xs text-gray-500 transform -translate-y-2">{h}:00</span>
        </div>
      );
    }
    return <div className="shrink-0">{horas}</div>;
  };
  
  // --- Renderizado de Citas (Componente Interno) ---
  const RenderizarCitasDelDia = ({ dia }: { dia: Date }) => {
    const citasDelDia = agendaData.citas.filter(c => isMismoDia(new Date(c.fecha), dia));
    const diaStr = dia.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

    // Encontrar el horario de trabajo para este día
    const horarioTrabajo = agendaData.horario.find(h => 
      DIAS_SEMANA_MAP[h.diaSemana.toLowerCase()] === dia.getDay()
    );

    return (
      <div className="relative h-full bg-gray-50 border-l border-gray-200">
        {/* Opcional: Renderizar el fondo de horario de trabajo */}
        {horarioTrabajo && (
          <div 
            className="absolute w-full bg-green-50 z-0"
            style={calcularPosicionBloque(horarioTrabajo.horaInicio, horarioTrabajo.horaFin)}
          ></div>
        )}

        {/* Renderizar Citas */}
        {citasDelDia.map(cita => (
          <CitaComponent key={cita.idCita} cita={cita} />
        ))}
      </div>
    );
  };
  
  /** Calcula el 'top' y 'height' de un bloque de cita */
  const calcularPosicionBloque = (inicio: string, fin: string) => {
    const minutosInicio = horaAMinutos(inicio);
    const minutosFin = horaAMinutos(fin);
    
    const minutosOffsetCalendario = HORA_INICIO_CALENDARIO * 60;

    const top = ((minutosInicio - minutosOffsetCalendario) / 60) * ALTURA_HORA_PX;
    const height = ((minutosFin - minutosInicio) / 60) * ALTURA_HORA_PX;

    return { top: `${top}px`, height: `${height}px` };
  };

  // --- Componente de Cita Individual ---
  const CitaComponent = ({ cita }: { cita: Cita }) => {
    const { top, height } = calcularPosicionBloque(cita.horaInicio, cita.horaFin);
    const duracion = horaAMinutos(cita.horaFin) - horaAMinutos(cita.horaInicio);

    return (
      <div
        className="absolute left-1 right-1 z-10 p-2 rounded-lg shadow-md overflow-hidden bg-indigo-100 border border-indigo-300"
        style={{ top, height }}
        title={`Cita con ${cita.pacienteNombre} ${cita.pacienteApellido}`}
      >
        <p className="font-semibold text-xs text-indigo-800 truncate">
          {cita.pacienteNombre} {cita.pacienteApellido}
        </p>
        {duracion > 30 && (
          <div className="flex items-center text-xs text-indigo-600 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            <span>{cita.horaInicio.substring(0, 5)} - {cita.horaFin.substring(0, 5)}</span>
          </div>
        )}
        {cita.linkCita && duracion > 45 && (
           <a 
             href={cita.linkCita} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center text-xs text-blue-600 hover:underline mt-1"
             onClick={(e) => e.stopPropagation()}
           >
             <Video className="w-3 h-3 mr-1" />
             Unirse a la cita
           </a>
        )}
      </div>
    );
  };

  // --- Renderizado Principal ---
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Asumimos que tienes un Navbar para el rol 'doctor'
  const navLinksDoctor = [
    { name: 'Mi Agenda', href: '/doctor/agenda', icon: Calendar },
    { name: 'Pacientes', href: '/doctor/pacientes', icon: Users },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar navLinks={navLinksDoctor} principal="/doctor" />
      
      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
        {/* --- Cabecera de Navegación --- */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Mi Agenda</h1>
            <button onClick={irHoy} className="text-sm rounded-md px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50">
              Hoy
            </button>
            <div className="flex items-center rounded-md border border-gray-300">
              <button onClick={irSemanaAnterior} className="p-1.5 hover:bg-gray-50 rounded-l-md">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={irSemanaSiguiente} className="p-1.5 hover:bg-gray-50 rounded-r-md border-l border-gray-300">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-indigo-600">
            {new Date(diasSemana[0]).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-red-100 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* --- Contenedor del Calendario (Scrollable) --- */}
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col" style={{ minWidth: '800px' }}>
            {/* --- Cabecera de Días --- */}
<div className="flex sticky top-0 bg-white z-20 shadow-sm">
  {/* Esquina vacía (misma anchura que la columna de horas) */}
  <div className="w-16 flex-shrink-0 border-r border-gray-200"></div>

  {/* Grid de 7 columnas para los días */}
  <div className="flex-1">
    <div className="grid grid-cols-7">
      {diasSemana.map(dia => {
        const { dia: diaStr, num } = formatCabeceraDia(dia);
        const esHoy = isMismoDia(dia, hoy);
        return (
          <div
            key={dia.toISOString()}
            className="col-span-1 flex items-center justify-center gap-2 py-2 border-l border-gray-200"
          >
            {/* Día en horizontal con la fecha al lado */}
            <span className="text-xs font-medium text-gray-500 uppercase">{diaStr}</span>
            <span
              className={`text-2xl font-bold inline-flex items-center justify-center ${
                esHoy
                  ? 'text-white bg-indigo-600 rounded-full w-8 h-8'
                  : 'text-gray-700'
              }`}
            >
              {num}
            </span>
          </div>
        );
      })}
    </div>
  </div>
</div>

{/* --- Cuerpo del Calendario --- */}
<div className="flex relative">
  {/* Columna de Horas (misma w-16 que la esquina vacía) */}
  <div className="w-16 flex-shrink-0 border-r border-gray-200">
    {renderizarHoras()}
  </div>

  {/* Columnas de Días y Citas: usar grid con 7 columnas para alinear con la cabecera */}
  <div className="grid grid-cols-7 flex-1 relative">
    {/* Líneas de fondo de hora */}
    {Array.from({ length: HORA_FIN_CALENDARIO - HORA_INICIO_CALENDARIO }).map((_, i) => (
      <div
        key={i}
        className="col-span-7 grid grid-cols-7 border-t border-gray-200"
        style={{ height: `${ALTURA_HORA_PX}px` }}
      >
        {Array.from({ length: 7 }).map((_, j) => (
          <div key={j} className={j > 0 ? "border-l border-gray-200" : ""}></div>
        ))}
      </div>
    ))}

    {/* Capa de Eventos (superpuesta) */}
    <div className="absolute inset-0 grid grid-cols-7">
      {diasSemana.map(dia => (
        <RenderizarCitasDelDia key={dia.toISOString()} dia={dia} />
      ))}
    </div>
  </div>
</div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default AgendaDoctorPage;