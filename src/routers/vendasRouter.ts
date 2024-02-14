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
    .get('/relatorio', (req, res) => {
        let {inicio, fim} = req.query
        if (!inicio)
            inicio = moment("1900-01-01", "YYYY-MM-DD").format("YYYY-MM-DD")
        if (!fim)
            fim = moment().format("YYYY-MM-DD")

        const dados = db.prepare(`
            SELECT
                venda.cod_venda as codigo,
                venda.'dta_venda ' as data,
                venda.'val_total_venda ' as valorTotal,
                cliente.cod_cliente as codigoCliente,
                cliente.des_nome as nomeCliente,
                cliente.des_cidade as cidadeCliente,
                cliente.des_uf as estadoCliente,
                cliente.des_telefone as telefoneCliente,
                item.cod_item as codigoItem,
                item.des_produto as nomeProduto,
                item.val_unitario as valorUnitario,
                item.qtd_itens as quantidade,
                item.val_total as valorTotalProduto
            FROM venda
            JOIN cliente ON 
                venda.cod_cliente = cliente.cod_cliente
            JOIN venda_item as item ON
                item.cod_venda = venda.cod_venda
            WHERE venda.'dta_venda ' >= @inicio
            AND venda.'dta_venda ' <= @fim
            AND cliente.flg_inativo = 0
        `).all({inicio, fim}) as any

        const vendas: any[] = []
        for (const fileira of dados) {
            const indice = fileira.codigo
            if (!vendas[indice]) {
                vendas[indice] = {
                    codigo: fileira.codigo,
                    data: fileira.data,
                    valorTotal: fileira.valorTotal,
                    cliente: {
                        codigo: fileira.codigoCliente,
                        nome: fileira.nomeCliente,
                        cidade: fileira.cidadeCliente,
                        estado: fileira.estadoCliente,
                        telefone: fileira.telefoneCliente
                    },
                    itens: []
                }
            }
            vendas[indice].itens.push({
                codigo: fileira.codigoItem,
                nome: fileira.nomeProduto,
                valorUnitario: fileira.valorUnitario,
                quantidade: fileira.quantidade,
                valorTotal: fileira.valorTotalProduto
            })
        }

        res.send(vendas.filter(x => x))
    })
    .post('/', (req, res) => {
        const { codigoCliente, data } = req.body
        let codigoVenda, valorTotal = 0
        
        db.transaction((produtos: VendaItem[]) => {
            codigoVenda = db.prepare(`
                INSERT INTO venda (cod_cliente, 'dta_venda ', 'val_total_venda ')
                VALUES (@codigoCliente, @data, 0)
            `).run({ codigoCliente, data }).lastInsertRowid

            for (const produto of produtos) {
                produto.dataCadastro = moment().format()
                produto.valorTotal = produto.valorUnitario * produto.quantidade
                valorTotal += produto.valorTotal

                db.prepare(`
                    INSERT INTO venda_item
                    (cod_venda, des_produto, val_unitario, 
                        qtd_itens, val_total, dta_cadastro) VALUES
                    (?, @nome, @valorUnitario,
                        @quantidade, @valorTotal, @dataCadastro)
                `).run(codigoVenda, produto)
            }

            db.prepare(`
                UPDATE venda
                SET 'val_total_venda ' = ?
                WHERE cod_venda = ?
            `).run(valorTotal, codigoVenda)

            db.prepare(`
                UPDATE cliente SET
                val_venda_acumulado = val_venda_acumulado + ?,
                qtd_venda_pedidos = qtd_venda_pedidos + 1,
                dta_ult_pedido = ?
                WHERE cod_cliente = ?`
            ).run(valorTotal, moment().format(), codigoCliente)

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

export default vendasRouter