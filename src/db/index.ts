import Database from "better-sqlite3"

const db = new Database('./db-teste.db', { fileMustExist: true })
db.pragma('journal_mode = WAL')

export default db