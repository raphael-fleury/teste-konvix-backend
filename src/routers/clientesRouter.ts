import { Router } from "express"

const clientesRouter = Router()
    .get('/', (req, res) => {
        res.send({})
    })
    .post('/', (req, res) => {
        res.send({})
    })
    .get('/:id', (req, res) => {
        res.send({})
    })
    .put('/:id', (req, res) => {
        res.send({})
    })
    .delete('/:id', (req, res) => {
        res.send({})
    })
    .get('/relatorio', (req, res) => {
        res.send({})
    })

export default clientesRouter