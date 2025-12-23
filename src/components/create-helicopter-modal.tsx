"use client"

import { useState } from "react"
import { CreateHelicopterForm } from "./create-helicopter-form"
import { Plus, X } from "lucide-react" // Usando os ícones que instalamos

export function CreateHelicopterModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão Gatilho (Aparece na tela inicial) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm cursor-pointer"
      >
        <Plus size={20} />
        Novo Helicóptero
      </button>

      {/* O Modal (Só renderiza se isOpen for true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Fundo Escuro (Backdrop) - Clicar nele fecha o modal */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Conteúdo do Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Cadastrar Aeronave</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* O Formulário que já criamos */}
            <CreateHelicopterForm onSuccess={() => setIsOpen(false)} />
            
          </div>
        </div>
      )}
    </>
  )
}