import { auth, signIn, signOut } from "@/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { CreateHelicopterModal } from "@/components/create-helicopter-modal"

export default async function Dashboard() {
  const session = await auth()

  // 1. Tela de Login (Se não tiver sessão)
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">HUMS System Analytic</h1>
        <form action={async () => { "use server"; await signIn("google") }}>
          <button className="bg-red-600 border border-slate-300 text-gray-200 px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-red-700 transition cursor-pointer">
            Entre com o Google
          </button>
        </form>
      </div>
    )
  }

  // 2. Busca os dados (Logado)
  const helicopters = await db.helicopter.findMany({
    // ATENÇÃO: Comentei a linha abaixo para evitar erro se o campo userId ainda não existir no banco.
    // Se já criou no schema.prisma, pode descomentar.
    // where: { userId: session.user?.id }, 
    orderBy: { createdAt: 'desc' },
    include: { alarms: true }
  })

  // --- A CORREÇÃO NECESSÁRIA PARA O BUILD ---
  type HelicopterType = typeof helicopters[number];

  // 3. Renderiza o Dashboard
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-red-600 border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-200">HUMS System Analytic</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-200 hidden md:inline">Olá, {session.user?.name}</span>
          <form action={async () => { "use server"; await signOut() }}>
            <button className="text-sm text-white hover:text-gray-200 font-medium border px-3 py-1 rounded hover:transition-normal cursor-pointer flex items-center">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-700">Sua Frota</h3>
          <CreateHelicopterModal />
        </div>

        {helicopters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 text-slate-500">
            Nenhum helicóptero cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* AQUI ESTÁ A ÚNICA MUDANÇA: Adicionei : HelicopterType */}
            {helicopters.map((heli: HelicopterType) => (
              <Link
                key={heli.id}
                href={`/helicopter/${heli.id}`}
                className="block group"
              >
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm group-hover:shadow-md group-hover:border-blue-300 transition h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition">
                        {heli.prefix}
                      </h4>
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">
                        {heli.model}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{heli.company}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                    <span className="text-slate-500">Alarmes</span>
                    <span className={`font-bold ${heli.alarms.length > 0 ? 'text-orange-500' : 'text-green-600'}`}>
                      {heli.alarms.length}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}