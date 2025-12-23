"use client"

import { createAlarm } from "@/actions/alarm"
import { useRef } from "react"

export function AlarmForm({ helicopterId }: { helicopterId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
      <h3 className="font-bold text-lg mb-4 text-slate-700">Novo Evento / Alarme</h3>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          await createAlarm(formData)
          formRef.current?.reset()
        }}
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="helicopterId" value={helicopterId} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <textarea 
            name="description" 
            rows={2}
            className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Descreva o alarme..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gravidade (Cor)</label>
          <select 
            name="color" 
            className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
            required
            defaultValue=""
          >
            <option value="" disabled>Selecione...</option>
            <option value="GREEN">Verde (OK)</option>
            <option value="YELLOW_NOT_CONFIRMED">Amarelo (Não Confirmado)</option>
            <option value="YELLOW_CONFIRMED">Amarelo (Confirmado)</option>
            <option value="RED_NOT_CONFIRMED">Vermelho (Não Confirmado)</option>
            <option value="RED_CONFIRMED">Vermelho (Confirmado)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-md transition self-end"
        >
          Registrar
        </button>
      </form>
    </div>
  )
}