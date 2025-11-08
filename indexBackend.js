const express = require('express')
const mysql = require('mysql2');
const app = express()
app.use(express.json())
const port = 3000

//SELECT `id`, `email`, `password` FROM `usuarios` WHERE 1

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'alcdatabase'
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const [rows] = await pool.promise()
    .query('SELECT `id`, `email`, `password`' +
      ' FROM `usuarios` WHERE email = ? AND password = ?',
      [email, password]);
  if (rows.length > 0) {
    res.send('Usuario logueado con Exito')
  } else {
    res.send('Credenciales incorrectas')
  }
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  const [rows] = await pool.promise()
    .query('SELECT `id`, `email`, `password`' +
      ' FROM `usuarios` WHERE email = ? AND password = ?',
      [email, password]);
  if (rows.length > 0) {
    res.send('Usuario ya registrado')
  } else {
    const [rows] = await pool.promise()
      .query('INSERT INTO `usuarios` (`email`, `password`) VALUES (?, ?)',
        [email, password]);
    res.send('Usuario registrado con Exito')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
