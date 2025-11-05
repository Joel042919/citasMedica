import { handleOut } from "@/auth/login";
import {useAuth} from "../../context/AuthContext";

const Navbar = () => {
  const {user, role, loading} = useAuth();

  if(loading){
    return <div>Cargando...</div>
  }


  return (
    <nav className="border">
      <p>Citas medicas</p>
      {user ? (
        <div>
          <p>{user.email}</p>
          <p>tu roles es {role}</p>
          <button className="bg-emerald-600 p-4 rounded-2xl cursor-pointer hover:p-3" onClick={() => handleOut()}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <p>Por favor, inicia sesión</p>
        </div>
      )}
    </nav>
  )
}

export default Navbar