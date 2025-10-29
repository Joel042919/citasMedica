import { supabase } from "../../lib/supabaseClient";


export async function handleLogin(email: string, password: string){
    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if(error){
        console.error("Error en el inicio de sesión:", error.message);
        return { error: error.message };
    }else{
        return { user: data.user };
    }
}

export async function getUserRole(userId: string) {
  
  // 1. ¿Es paciente?
  //    No usamos .single() para evitar el error 406.
  //    .limit(1) hace la consulta súper rápida.
  const { data: pacient } = await supabase
    .from('paciente')
    .select('idpaciente')
    .eq('idpaciente', userId)
    .limit(1);
    
  // Si el array 'pacient' no es nulo Y tiene al menos 1 elemento...
  if (pacient && pacient.length > 0) {
    return 'paciente';
  }

  // 2. ¿Es médico?
  const { data: medico } = await supabase
    .from('medico')
    .select('idmedico')
    .eq('idmedico', userId)
    .limit(1);
    
  if (medico && medico.length > 0) {
    return 'medico';
  }

  // 3. ¿Es admin?
  const { data: admin } = await supabase
    .from('admin')
    .select('idadmin')
    .eq('idadmin', userId)
    .limit(1);
    
  if (admin && admin.length > 0) {
    return 'administrador';
  }

  // Si no se encontró en ninguna tabla
  console.error(`Error: Usuario ${userId} no tiene rol asignado en DB.`);
  return null;
}