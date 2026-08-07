import mysql, { type Pool } from 'mysql2/promise'

let readPool: Pool | undefined
let writePool: Pool | undefined

function createDatabasePool(user: string, password: string) {
  const config = useRuntimeConfig()

  return mysql.createPool({
    host: config.mysqlHost,
    port: Number(config.mysqlPort),
    database: config.mysqlDatabase,
    user,
    password,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
    multipleStatements: false,
    decimalNumbers: true,
    timezone: 'Z',
    enableKeepAlive: true
  })
}

export function getReadDb() {
  const config = useRuntimeConfig()
  readPool ??= createDatabasePool(config.mysqlQueryUser, config.mysqlQueryPassword)
  return readPool
}

export function getWriteDb() {
  const config = useRuntimeConfig()
  writePool ??= createDatabasePool(config.mysqlWriteUser, config.mysqlWritePassword)
  return writePool
}
