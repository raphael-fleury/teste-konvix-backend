import express from 'express'
import cors from 'cors'
import clientesRouter from './routers/clientesRouter'
import vendasRouter from './routers/vendasRouter'
import authRouter from './routers/authRouter'

const port = process.env.PORT || 4000
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send({ message: "Hello World" })
})

app.use('/api/clientes', clientesRouter)
app.use('/api/vendas', vendasRouter)
app.use('/api/usuario', authRouter)

app.use((req, res) => {
    const {url, method} = req
    res.status(404).send({
        message: `A rota ${url} não existe ou não suporta o método ${method}`
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando com sucesso na porta ${port}`)
})