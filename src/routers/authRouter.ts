import { Router } from "express";
import { NovoUsuario, Usuario, novoUsuarioSchema } from "../models/usuario";
import { encrypt } from "../util/encrypt";
import { createToken } from "../util/jwt";
import db from "../db";
import bcrypt from "bcrypt"

const maxAgeCookie = 60 * 60 * 24 * 7 //7 days

const authRouter = Router()
    .post('/login', (req, res) => {
        const {email, senha} = novoUsuarioSchema.parse(req.body)
        const usuario = db.prepare(`
            SELECT
                cod_usuario as codigo,
                des_email as email,
                des_senha as senha
            FROM usuario
            WHERE des_email = ?
            AND flg_inativo = 0
        `).get(email) as Usuario & NovoUsuario

        if (!usuario)
            return res.status(404).send({message: "Nenhum usuário encontrado com este e-mail"})

        if (!bcrypt.compareSync(senha, usuario.senha)) {
            return res.status(400).send({message: "Senha incorreta"})
        }

        const token = createToken({codigo: usuario.codigo})
        res.cookie("token", token, { httpOnly: true, maxAge: maxAgeCookie, sameSite: "none" })
        res.status(200).send({codigo: usuario.codigo, email})
    })
    .post('/registro', (req, res) => {
        const {email, senha} = novoUsuarioSchema.parse(req.body)
        const usuario = db.prepare(`
            SELECT * FROM usuario
            WHERE des_email = ?
            AND flg_inativo = 0
        `).get(email)

        if (usuario)
            return res.status(409).send({message: "Já existe um usuário com este e-mail"})

        const senhaCriptografada = encrypt(senha)
    
        const codigo = db.prepare(`
            INSERT INTO usuario(des_email, des_senha) VALUES(?, ?)
        `).run(email, senhaCriptografada).lastInsertRowid

        const token = createToken({codigo})
        res.cookie("token", token, { httpOnly: true, maxAge: maxAgeCookie, sameSite: "none" })
        res.status(201).send({codigo, email})
    })
    .post('/logout', (req, res) => {
        res.clearCookie("token")
        res.status(200).send({message: "Logout feito com sucesso"})
    })

export default authRouter