import { redirect } from "next/navigation";
import { createClient } from "../../../lib/server";

export default async function AdminLayout({children}: {children: React.ReactNode}){
    const supabase = createClient()
    const {data:{user}} = await (await supabase).auth.getUser();

    if(!user){
        redirect('/login')
    }

    const {data:profile} = await (await supabase).from('profiles').select('*').eq('id', user.id).single()

    if(profile?.rol!=='admin'){
        redirect('/login')
    }

    return <>{children}</>
}
    



