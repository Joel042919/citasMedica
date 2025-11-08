"use client";
import Navbar from '../components/Navbar'
import {
  Calendar,     // Icono para Citas
} from 'lucide-react';

const HomeDoctor = () => {
  return (
    <div className="relative flex flex-col md:flex-row flex-4">
      <Navbar navLinks={[{name: "Agenda", href: "/doctor/agenda", icon: Calendar }]} principal="/doctor" />
      <div className="p-8 space-y-8 flex-2">
        <h1 className="text-3xl font-bold mb-6">Dashboard Doctor</h1>
      </div>
    </div>
  )
}

export default HomeDoctor