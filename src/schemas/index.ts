// Esse arquivo serve para definimos o schemas dos dados ou sej acomo eles devem ser

import { z } from "zod" //biblioteca de verificacao de dados
import { AlarmColor } from "@prisma/client" 

const cuid2Regex = /^[a-z][a-z0-9]{24}$/;

export const CreateHelicopterSchema = z.object({
  prefix: z.string().min(3, "Prefixo deve ser no minimo 3 caracteres").toUpperCase(),
  model: z.string().min(1, "Modelo é obrigatório"),
  company: z.string().min(1 , "Empresa é obrigatória")
})

export const UpdateHelicopiterSchema = CreateHelicopterSchema.extend({
  id: z.string().regex(cuid2Regex, "ID inválido.")
})



// Tipos inferidos automaticamente do Zod
export type CreateHelicopterInput = z.infer<typeof CreateHelicopterSchema>



export const CreateAlarmSchema = z.object({
  helicopterId: z.string().regex(cuid2Regex),
  description: z.string().min(5, "Descrição muito curta"),
  color: z.enum(AlarmColor)
})


export type CreateAlarmInput = z.infer<typeof CreateAlarmSchema>