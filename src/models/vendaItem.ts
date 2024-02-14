import { z } from 'zod'

export const novoItemSchema = z.object({
    nome: z.string().min(1),
    valorUnitario: z.number().min(0),
    quantidade: z.number().min(1)
})

export type NovoItem = z.infer<typeof novoItemSchema>

export type VendaItem = NovoItem & {
    codigoItem: number
    codigoVenda: number
    valorTotal: number
    dataCadastro: string
}