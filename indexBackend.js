const express = require('express')
const mysql = require('mysql2');
const cors = require('cors');
const app = express()

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json())
const port = 3000

//SELECT `id`, `email`, `password` FROM `usuarios` WHERE 1

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'alcdatabase'
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await pool.promise()
      .query('SELECT `id`, `email`, `password`' +
        ' FROM `usuarios` WHERE email = ? AND password = ?',
        [email, password]);
    if (rows.length > 0) {
      res.send('Usuario logueado con Exito')
    } else {
      res.status(401).send('Credenciales incorrectas')
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al conectar con la base de datos')
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
