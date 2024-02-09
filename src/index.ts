import express from 'express'
import clientesRouter from './routers/clientesRouter'
import vendasRouter from './routers/vendasRouter'

const port = process.env.PORT || 4000
const app = express()

app.get('/', (req, res) => {
    res.send({ message: "Hello World" })
})

app.use('/api/clientes', clientesRouter)
app.use('/api/vendas', vendasRouter)

app.use((req, res) => {
    res.status(404).send({ message: "Unknown route" })
})

app.listen(port, () => {
    console.log(`Servidor rodando com sucesso na porta ${port}`)
})