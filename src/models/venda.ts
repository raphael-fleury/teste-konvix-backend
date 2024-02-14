import { z } from 'zod'
import { novoItemSchema } from './vendaItem'

export const novaVendaSchema = z.object({
    codigoCliente: z.number().min(1),
    data: z.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
    produtos: z.array(novoItemSchema).min(1)
})

export type NovaVenda = z.infer<typeof novaVendaSchema>

export type Venda = {
    codigo: number
    codigoCliente: number
    data: string
    valorTotal: number
}