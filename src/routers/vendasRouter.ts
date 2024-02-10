import { Router } from "express"
import { Venda } from "../models/venda"
import db from "../db"
import moment from "moment"

const vendasRouter = Router()
    .get('/', (req, res) => {
        const vendas = db.prepare(`SELECT
            cod_venda as codigo, cod_cliente as codigoCliente, 
            "dta_venda " as data, "val_total_venda " as valorTotal
        FROM venda`).all()

        res.send(vendas)
    })
    .post('/', (req, res) => {
        const venda = req.body
        const { lastInsertRowid } = db.prepare(`INSERT INTO venda 
            (cod_cliente, 'dta_venda ', 'val_total_venda ') VALUES
            (@codigoCliente, @data, @valorTotal)
        `).run(venda)
        
        venda.codigo = lastInsertRowid
        res.status(201).location(`/vendas/${venda.codigo}`).send(venda)
    })
    .get('/:id', (req, res) => {
        const codigo = req.params.id
        const venda = db.prepare(`SELECT
            cod_venda as codigo, cod_cliente as codigoCliente, 
            "dta_venda " as data, "val_total_venda " as valorTotal
        FROM venda WHERE cod_venda = ?`).all(codigo)

        if (venda)
            res.send(venda)
        else
            res.status(404).send({ message: "Venda não encontrada" })
    })
    .get('/relatorio', (req, res) => {
        res.send({})
    })

export default vendasRouter