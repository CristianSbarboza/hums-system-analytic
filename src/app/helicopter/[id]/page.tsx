import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AlarmForm } from "@/components/alarm-form";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteHelicopter } from "@/actions/helicopter";
import { deleteAlarm } from "@/actions/alarm"; // Importando a action de deletar alarme

// Mantendo o TEU padrão de cores (Inglês - Padrão do Banco)
const colorStyles: Record<string, string> = {
  GREEN: "bg-green-50 border-green-200 text-green-800",
  YELLOW_NOT_CONFIRMED: "bg-yellow-50 border-yellow-200 text-yellow-800 border-dashed",
  YELLOW_CONFIRMED: "bg-yellow-100 border-yellow-400 text-yellow-900",
  RED_NOT_CONFIRMED: "bg-red-50 border-red-200 text-red-800 border-dashed",
  RED_CONFIRMED: "bg-red-100 border-red-400 text-red-900 font-medium",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HelicopterPage(props: PageProps) {
  const session = await auth();
  if (!session) redirect("/");

  const params = await props.params;
  const helicopterId = params.id;

  // 1. Buscar dados no banco
  const helicopter = await db.helicopter.findUnique({
    where: { id: helicopterId },
    include: {
      alarms: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!helicopter) return notFound();

  // 2. Lógica para Agrupar por Dia
  const alarmsByDate = helicopter.alarms.reduce((groups, alarm) => {
    const date = alarm.createdAt.toLocaleDateString("pt-BR");
    if (!groups[date]) groups[date] = [];
    groups[date].push(alarm);
    return groups;
  }, {} as Record<string, typeof helicopter.alarms>);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-500 hover:text-blue-600 transition font-medium"
            >
              ← Voltar
            </Link>
            <h1 className="text-xl font-bold text-slate-800">
              {helicopter.prefix}{" "}
              <span className="font-normal text-slate-400">
                | {helicopter.model}
              </span>
            </h1>
          </div>

          {/* Botão de Excluir Helicóptero */}
          <form
            action={async () => {
              "use server";
              await deleteHelicopter(helicopter.id);
            }}
          >
            <button 
              type="submit"
              className="text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 transition"
            >
              Excluir Helicóptero
            </button>
          </form>

        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4">
        <AlarmForm helicopterId={helicopter.id} />

        <h3 className="text-lg font-bold text-slate-700 mb-6 pb-2 border-b">
          Histórico de Alarmes
        </h3>

        {Object.keys(alarmsByDate).length === 0 ? (
          <p className="text-slate-500 text-center italic">
            Nenhum histórico disponível.
          </p>
        ) : (
          <div className="space-y-8">
            {Object.keys(alarmsByDate).map((date) => (
              <div
                key={date}
                className="relative pl-6 border-l-2 border-slate-300"
              >
                <div className="absolute -left- top-0 w-4 h-4 rounded-full bg-slate-400 border-2 border-slate-50"></div>
.
                <h4 className="text-sm font-bold text-slate-500 mb-3">
                  {date}
                </h4>

                <div className="space-y-3">
                  {alarmsByDate[date].map((alarm) => (
                    <div
                      key={alarm.id}
                      className={`p-4 rounded-lg border ${
                        colorStyles[alarm.color] || "bg-white border-gray-200"
                      } relative group`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span>{alarm.description}</span>
                        <span className="text-xs opacity-70 whitespace-nowrap">
                          {alarm.createdAt.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Botão de Excluir Alarme */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-200">
                        <form
                            action={async () => {
                                "use server"
                                await deleteAlarm(alarm.id, helicopter.id) 
                            }}
                        >
                            <button 
                                type="submit" 
                                className="bg-white/60 hover:bg-red-500 hover:text-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm text-xs font-bold transition-colors"
                                title="Excluir evento"
                            >
                                ✕
                            </button>
                        </form>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}