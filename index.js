//mariadb connector
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: 'test',
     port:"3306",
     database:"BudaDB",
     connectionLimit: 1
});
async function dbconnect(runquery) {
  let conn;
  try {
  console.log(runquery)
	conn = await pool.getConnection();
	const rows = await conn.query(runquery);
	console.log(rows); //[ {val: 1}, meta: ... ]
  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

//setting up express server
const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
//use static public standard
const path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(path.join(__dirname, '/index.html'));
});

app.post("/action",(req,res)=>{
  console.log("enter")
  var querydb="Insert into Registry(name, data) values ('"+req.body.name+"','"+req.body.data+"')"
  console.log(querydb)
  dbconnect(querydb)
  res.redirect('back');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});