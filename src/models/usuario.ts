import { z } from 'zod'

export const novoUsuarioSchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6).max(24)
})

export type NovoUsuario = z.infer<typeof novoUsuarioSchema>

export type Usuario = {
    codigo: number,
    email: string
}