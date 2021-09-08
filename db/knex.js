const knexCache = new Map();
const Knex = require("knex");
let knex_config = {
  client: "mssql",
  connection: {
    user: 'sa',
    password: '556556',
    trustServerCertificate: true,
    server: 'localhost'
  },
  pool: { min: 2, max: 5, idleTimeoutMillis: 3000000 },
  acquireConnectionTimeout: 3000000,
};

module.exports = async (banco) => {
  let knexConnection = knexCache.get(banco);

  if (knexConnection) return knexConnection;

  const config = await getKnexConfig(banco);
  knexConnection = Knex(config);
  knexCache.set(banco, knexConnection);
  return knexConnection;
};

const getKnexConfig = async (banco) => {
  knex_config.connection.database = banco;
  return knex_config;
};
