import { z } from 'zod'

export const filtroDataSchema = z.object({
    inicio: z.optional(z.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)),
    fim: z.optional(z.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/))
})