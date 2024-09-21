module.exports = {
  HOST: "brrax.ddns.net",
  PORT: "1433",
  USER: "karla",
  PASSWORD: "kaR22la",
  DB: "gym2",
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
