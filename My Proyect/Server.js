const express = require('express');
const db = require('./DataBase.js');
const router = require('./Routes/Routes.js');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Views')));
app.use('/api',router);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});