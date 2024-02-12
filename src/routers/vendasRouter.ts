import { Router } from "express"
import db from "../db"
import moment from "moment"
import { VendaItem } from "../models/vendaItem"

const vendasRouter = Router()
    .get('/', (req, res) => {
        const vendas = db.prepare(`SELECT
            cod_venda as codigo, cod_cliente as codigoCliente, 
            "dta_venda " as data, "val_total_venda " as valorTotal
        FROM venda`).all()

        res.send(vendas)
    })
    .post('/', (req, res) => {
        const { codigoCliente, data } = req.body
        let codigoVenda, valorTotal = 0
        
        db.transaction((produtos: VendaItem[]) => {
            codigoVenda = db.prepare(`INSERT INTO venda 
                (cod_cliente, 'dta_venda ', 'val_total_venda ') VALUES
                (@codigoCliente, @data, 0)
            `).run({ codigoCliente, data }).lastInsertRowid

            for (const produto of produtos) {
                produto.dataCadastro = moment().format()
                produto.valorTotal = produto.valorUnitario * produto.quantidade
                valorTotal += produto.valorTotal

                db.prepare(`INSERT INTO venda_item
                    (cod_venda, des_produto, val_unitario, 
                        qtd_itens, val_total, dta_cadastro) VALUES
                    (?, @nome, @valorUnitario,
                        @quantidade, @valorTotal, @dataCadastro)
                `).run(codigoVenda, produto)
            }

            db.prepare(`UPDATE venda
                SET 'val_total_venda ' = ?
                WHERE cod_venda = ?
            `).run(valorTotal, codigoVenda)
        })(req.body.produtos)
        
        const venda = {codigoVenda, }
        res.status(201).location(`/vendas/${codigoVenda}`).send(venda)
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