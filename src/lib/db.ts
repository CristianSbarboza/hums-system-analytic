// src/lib/db.ts

import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg' // Cliente Node.js para PostgreSQL
import { PrismaPg } from '@prisma/adapter-pg' // Adaptador do Prisma

// 1. Obter a URL de conexão (Assumimos que está em .env)
const connectionString = process.env.DATABASE_URL! 

// 2. Criar uma Pool de Conexão com o driver 'pg'
const pool = new Pool({ connectionString })

// 3. Criar o adaptador do Prisma
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const db = 
  globalForPrisma.prisma ??
  new PrismaClient({
    // 4. Fornecer o 'adapter' no construtor.
    // Isto satisfaz a validação estrita do motor 'client' do Next.js.
    adapter,
    // (Opcional) Podes adicionar log aqui, mas o adaptador já resolve o problema.
    log: ["query"], 
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db