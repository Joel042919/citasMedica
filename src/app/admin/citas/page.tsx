"use client";
import Navbar from '@/app/components/Navbar'
import React from 'react'

import {
  Users,        // Icono para Pacientes
  Stethoscope,  // Icono para Médicos
  Calendar,     // Icono para Citas
  FileText,     // Icono para Reportes
} from 'lucide-react';

const navLinks = [
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Médicos', href: '/admin/medicos', icon: Stethoscope },
    { name: 'Citas Médicas', href: '/admin/citas', icon: Calendar },
    { name: 'Reportes', href: '/admin/reportes', icon: FileText },
];

const CitasPage = () => {
  return (
    <div>
      <Navbar navLinks={navLinks} principal="/admin"/>
      CitasPage
    </div>
  )
}

export default CitasPage