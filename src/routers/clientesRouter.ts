import { Router } from "express"
import { Cliente } from "../models/cliente"
import db from "../db"
import moment from "moment"

const clientesRouter = Router()
    .get('/', (req, res) => {
        const clientes = db.prepare(`SELECT
            cod_cliente as codigo, des_nome as nome, 
            des_endereco as endereco, num_endereco as numeroEndereco, 
            des_cidade as cidade, des_uf as estado, des_telefone as telefone, 
            des_contato as contato, dta_ult_pedido as dataUltimoPedido, 
            dta_cadastro as dataCadastro, dta_alteracao as dataAlteracao
        FROM cliente WHERE flg_inativo = 0`).all()
        res.send(clientes)
    })
    .get('/relatorio', (req, res) => {
        const relatorio = db.prepare(`SELECT
            cod_cliente as codigo, des_nome as nome,
            val_venda_acumulado as valorDeVendaAcumulado,
            dta_ult_pedido as dataUltimoPedido
        FROM cliente WHERE flg_inativo = 0 ORDER BY dta_ult_pedido DESC`).all()
        
        res.send(relatorio)
    })
    .post('/', (req, res) => {
        const now = moment().format()
        const cliente: Cliente = {
            ...req.body,
            dataCadastro: now,
            dataAlteracao: now,
            dataUltimoPedido: now
        }

        const { lastInsertRowid } = db.prepare(`INSERT INTO cliente (
            des_nome, flg_inativo, des_endereco, num_endereco, des_cidade, des_uf, 
            des_telefone, des_contato, dta_ult_pedido, dta_cadastro, dta_alteracao
        ) VALUES (
            @nome, 0, @endereco, @numeroEndereco, @cidade, @estado, @telefone, 
            @contato, @dataUltimoPedido, @dataAlteracao, @dataUltimoPedido
        )`).run(cliente)
        cliente.codigo = Number(lastInsertRowid)

        res.status(201).location(`/clientes/${cliente.codigo}`).send(cliente)
    })
    .get('/:id', (req, res) => {
        const codigo = req.params.id
        const cliente = db.prepare(`SELECT
            cod_cliente as codigo, des_nome as nome, 
            des_endereco as endereco, num_endereco as numeroEndereco, 
            des_cidade as cidade, des_uf as estado, des_telefone as telefone, 
            des_contato as contato, dta_ult_pedido as dataUltimoPedido, 
            dta_cadastro as dataCadastro, dta_alteracao as dataAlteracao
        FROM cliente WHERE cod_cliente = ? AND flg_inativo = 0`).get(codigo)

        if (cliente)
            res.send(cliente)
        else
            res.status(404).send({ message: "Cliente não encontrado" })
    })
    .put('/:id', (req, res) => {
        const codigo = req.params.id
        const cliente: any = db.prepare(`SELECT
            cod_cliente as codigo, des_nome as nome, 
            des_endereco as endereco, num_endereco as numeroEndereco, 
            des_cidade as cidade, des_uf as estado, des_telefone as telefone, 
            des_contato as contato, dta_ult_pedido as dataUltimoPedido, 
            dta_cadastro as dataCadastro, dta_alteracao as dataAlteracao
        FROM cliente WHERE cod_cliente = ? AND flg_inativo = 0`).get(codigo)

        if (!cliente) {
            res.status(404).send({ message: "Cliente não encontrado" })
            return
        }

        const clienteAtualizado = {
            ...cliente,
            ...req.body
        }

        db.prepare(`UPDATE cliente SET
            des_nome = @nome, des_endereco = @endereco, num_endereco = @numeroEndereco,
            des_cidade = @cidade, des_uf = @estado, des_telefone = @telefone, 
            des_contato = @contato, dta_ult_pedido = @dataUltimoPedido, 
            dta_cadastro = @dataCadastro, dta_alteracao = @dataAlteracao
        WHERE cod_cliente = @codigo`).run(clienteAtualizado)

        res.send(clienteAtualizado)
    })
    .delete('/:id', (req, res) => {
        const codigo = req.params.id
        const cliente = db.prepare(`
            UPDATE cliente SET flg_inativo = 1
            WHERE cod_cliente = ? AND flg_inativo = 0
        `).run(codigo)

        if (cliente)
            res.send(cliente)
        else
            res.status(404).send({ message: "Cliente não encontrado" })
    })

export default clientesRouter