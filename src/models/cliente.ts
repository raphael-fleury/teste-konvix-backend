import { z } from 'zod'

export const novoClienteSchema = z.object({
    nome: z.string(),
    endereco: z.string(),
    numeroEndereco: z.optional(z.coerce.number()),
    cidade: z.string(),
    estado: z.string().length(2),
    telefone: z.string().regex(/^\d+$/),
    contato: z.string(),
})

export type NovoCliente = z.infer<typeof novoClienteSchema>

export type Cliente = NovoCliente & {
    codigo: number
    valorDeVendaAcumulado: number
    pedidosDeVenda: number
    dataUltimoPedido: string
    dataCadastro: string
    dataAlteracao: string
}