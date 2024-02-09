import express from 'express'

const port = process.env.PORT || 4000
const app = express()

app.get('/', (req, res) => {
    res.send({ message: "Hello World" })
})

app.use((req, res) => {
    res.status(404)
})

app.listen(port, () => {
    console.log(`Servidor rodando com sucesso na porta ${port}`)
})