"use client"

import { createHelicopter } from "@/actions/helicopter"
import { useRef } from "react"

interface Props {
  onSuccess?: () => void
}

export function CreateHelicopterForm({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await createHelicopter(formData)
        formRef.current?.reset()

        if (onSuccess) onSuccess()
      }} 
      className="flex flex-col gap-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Prefixo</label>
        <input 
          name="prefix" 
          placeholder="Ex: PT-XYZ" 
          className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
        <input 
          name="model" 
          placeholder="Ex: AW-139" 
          className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-red-500" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Empresa</label>
        <input 
          name="company" 
          placeholder="Ex: Leonardo" 
          className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-red-500" 
          required 
        />
      </div>

      <button 
        type="submit" 
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition w-full mt-2 cursor-pointer"
      >
        Salvar Helicóptero
      </button>
    </form>
  )
}