import express, { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import clientesRouter from './routers/clientesRouter'
import vendasRouter from './routers/vendasRouter'
import authRouter from './routers/authRouter'

const port = process.env.PORT || 4000
const app = express()

console.log(process.env.FRONTEND_URL)
app.use(cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000", "*"],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send({ message: "Hello World" })
})

app.use('/api/usuario', authRouter)
app.use((req, res, next) => {
    const jwt = req.cookies?.token

    if (!jwt)
        return res.status(401).send({message: "Não autorizado"})

    next()
})

app.use('/api/clientes', clientesRouter)
app.use('/api/vendas', vendasRouter)

app.use((req, res) => {
    const {url, method} = req
    res.status(404).send({
        message: `A rota ${url} não existe ou não suporta o método ${method}`
    })
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        const {errors} = error
        return res.status(400).send({errors})
    }

    return res.status(500).send({message: "Erro desconhecido"})
})

app.listen(port, () => {
    console.log(`Servidor rodando com sucesso na porta ${port}`)
})