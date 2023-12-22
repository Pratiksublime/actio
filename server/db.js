const { Pool, Client } = require('pg')

console.log(process.env.DATABASE)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASS,
  port: 5432,
})


console.log("db")

module.exports = {
  query: (text, params) => {
    // if(text.includes("'") && text.includes("INSERT")) {

    // }
    //  console.log('text12.......')
    // console.log(text)
    return pool.query(text, params)
    // console.log('text.......')
    // console.log(text)
  },
}