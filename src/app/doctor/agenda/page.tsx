"use client";

import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../components/Navbar"; 


import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  Users, Stethoscope, Calendar, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Clock, Video, User,
} from 'lucide-react';


// --- Tipos de Datos ---
interface Cita {
  idCita: number;
  fecha: string; // "YYYY-MM-DD"
  horaInicio: string; // "HH:mm:ss"
  horaFin: string; // "HH:mm:ss"
  linkCita?: string | null;
  pacienteNombre: string;
  pacienteApellido: string;
}

interface Horario {
  diaSemana: string;
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
const HORA_INICIO_CALENDARIO = 7;
const HORA_FIN_CALENDARIO = 20;
const ALTURA_HORA_PX = 60;
const HORAS_CALENDARIO = Array.from(
  { length: HORA_FIN_CALENDARIO - HORA_INICIO_CALENDARIO },
  (_, i) => i + HORA_INICIO_CALENDARIO
);

// --- Funciones de Ayuda de Fechas (Optimizadas) ---
// (Estas funciones son rápidas y no necesitan cambios)
const getInicioSemana = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
};

const getDiasDeLaSemana = (inicioSemana: Date): Date[] => {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + i);
    return d;
  });
};

const formatCabeceraDia = (date: Date): { dia: string, num: number } => {
  const dia = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
  const num = date.getDate();
  return { dia, num };
};

const isMismoDia = (d1: Date, d2: Date): boolean => {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
};

const horaAMinutos = (timeStr: string): number => {
  const [hours = 0, minutes = 0] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/** Calcula el 'top' y 'height' de un bloque (movida fuera del componente) */
const calcularPosicionBloque = (inicio: string, fin: string) => {
  const minutosInicio = horaAMinutos(inicio);
  const minutosFin = horaAMinutos(fin);
  const minutosOffsetCalendario = HORA_INICIO_CALENDARIO * 60;

  const top = ((minutosInicio - minutosOffsetCalendario) / 60) * ALTURA_HORA_PX;
  const height = ((minutosFin - minutosInicio) / 60) * ALTURA_HORA_PX;

  return { top: `${top}px`, height: `${height}px` };
};

// --- Componentes Memoizados ---

/**
 * Componente de Cita Individual
 * Usamos React.memo para evitar que se re-renderice si la 'cita' no ha cambiado.
 */
const CitaComponent = memo(({ cita }: { cita: Cita }) => {
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
});
CitaComponent.displayName = 'CitaComponent'; // Para mejor debugging

/**
 * Componente de Columna de Día
 * Memoizado para evitar re-renderizado si las citas y horarios del día no cambian.
 */
const DiaColumna = memo(({ citas, horarios }: { citas: Cita[], horarios: Horario[] }) => {
  return (
    <div className="relative col-span-1 border-l border-gray-200">
      {/* 1. Líneas de fondo (MUCHO MÁS SIMPLE) */}
      {HORAS_CALENDARIO.map(hora => (
        <div 
          key={hora} 
          className="h-full border-t border-gray-200" 
          style={{ height: `${ALTURA_HORA_PX}px` }}
        ></div>
      ))}

      {/* 2. Bloques de Horario de Trabajo */}
      {horarios.map((horario, index) => (
        <div 
          key={index}
          className="absolute w-full bg-green-50 z-0"
          style={calcularPosicionBloque(horario.horaInicio, horario.horaFin)}
        ></div>
      ))}
      
      {/* 3. Bloques de Citas */}
      {citas.map(cita => (
        <CitaComponent key={cita.idCita} cita={cita} />
      ))}
    </div>
  );
});
DiaColumna.displayName = 'DiaColumna'; // Para mejor debugging

// --- Componente Principal de la Agenda ---
const AgendaDoctorPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date("2025-11-10T10:00:00")); // Mock date
  const [agendaData, setAgendaData] = useState<AgendaData>({ citas: [], horario: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inicioSemana = useMemo(() => getInicioSemana(currentDate), [currentDate]);
  const diasSemana = useMemo(() => getDiasDeLaSemana(inicioSemana), [inicioSemana]);
  const hoy = useMemo(() => new Date(), []); // Solo se calcula una vez

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

  // --- OPTIMIZACIÓN: Pre-cálculo de citas y horarios ---
  // Esto transforma la lista de citas en un Map para acceso O(1)
  const citasPorDia = useMemo(() => {
    const map = new Map<string, Cita[]>();
    // Inicializar el map para todos los días de la semana
    for (const dia of diasSemana) {
      map.set(dia.toISOString().split('T')[0], []);
    }
    // Llenar el map con las citas
    for (const cita of agendaData.citas) {
      const citaFecha = new Date(cita.fecha).toISOString().split('T')[0];
      map.get(citaFecha)?.push(cita);
    }
    return map;
  }, [agendaData.citas, diasSemana]);

  // Esto transforma la lista de horarios en un Map para acceso O(1)
  const horarioPorDia = useMemo(() => {
    const map = new Map<number, Horario[]>();
    for (let i = 0; i < 7; i++) {
      map.set(i, []); // 0 = Domingo, 1 = Lunes, etc.
    }
    for (const horario of agendaData.horario) {
      const diaIndex = DIAS_SEMANA_MAP[horario.diaSemana.toLowerCase()];
      if (diaIndex !== undefined) {
        map.get(diaIndex)?.push(horario);
      }
    }
    return map;
  }, [agendaData.horario]);


  // --- Manejadores de Eventos (rápidos, sin cambios) ---
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
  const renderizarHoras = useMemo(() => {
    return (
      <div className="w-16 flex-shrink-0 border-r border-gray-200">
        {/* Espacio vacío para la cabecera */}
        <div className="h-[65px] sticky top-0 bg-white z-20"></div>
        {HORAS_CALENDARIO.map(h => (
          <div key={h} className="h-full flex justify-end items-start pt-1 pr-2" style={{ height: `${ALTURA_HORA_PX}px` }}>
            <span className="text-xs text-gray-500 transform -translate-y-2">{h}:00</span>
          </div>
        ))}
      </div>
    );
  }, []); // Este componente nunca cambia, así que lo memoizamos

  // --- Renderizado Principal ---
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  const navLinksDoctor = [
    { name: 'Mi Agenda', href: '/doctor/agenda', icon: Calendar },
    { name: 'Pacientes', href: '/doctor/pacientes', icon: Users },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar navLinks={navLinksDoctor} principal="/doctor" />
      
      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
        {/* Cabecera de Navegación */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Mi Agenda</h1>
            <button onClick={irHoy} className="text-sm rounded-md px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50">Hoy</button>
            <div className="flex items-center rounded-md border border-gray-300">
              <button onClick={irSemanaAnterior} className="p-1.5 hover:bg-gray-50 rounded-l-md"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
              <button onClick={irSemanaSiguiente} className="p-1.5 hover:bg-gray-50 rounded-r-md border-l border-gray-300"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-indigo-600">
            {new Date(diasSemana[0]).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-red-100 text-red-700">
            <AlertCircle className="h-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* --- Contenedor del Calendario (Scrollable) --- */}
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow-md border border-gray-200">
          
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[500px]">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="flex" style={{ minWidth: '800px' }}>
              
              {/* Columna de Horas (Sticky a la izquierda) */}
              {renderizarHoras}

              {/* Contenedor Principal de Días (Scrollable horizontalmente) */}
              <div className="flex-1 flex flex-col">
                
                {/* Cabecera de Días (Sticky arriba) */}
                <div className="flex sticky top-0 bg-white z-10 shadow-sm">
                  <div className="grid grid-cols-7 flex-1">
                    {diasSemana.map(dia => {
                      const { dia: diaStr, num } = formatCabeceraDia(dia);
                      const esHoy = isMismoDia(dia, hoy);
                      return (
                        <div key={dia.toISOString()} className="col-span-1 flex flex-col items-center justify-center py-2">
                          <span className="text-xs font-medium text-gray-500">{diaStr}</span>
                          <span className={`text-2xl font-bold mt-1 ${esHoy ? 'text-white bg-indigo-600 rounded-full w-9 h-9 flex items-center justify-center' : 'text-gray-700'}`}>
                            {num}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Cuerpo del Calendario (Grid de días) */}
                <div className="grid grid-cols-7 flex-1">
                  {diasSemana.map(dia => {
                    const isoDate = dia.toISOString().split('T')[0];
                    const diaIndex = dia.getDay();
                    return (
                      <DiaColumna
                        key={isoDate}
                        citas={citasPorDia.get(isoDate) || []}
                        horarios={horarioPorDia.get(diaIndex) || []}
                      />
                    );
                  })}
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AgendaDoctorPage;