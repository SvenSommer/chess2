const express = require("express");
const app = express();
const path = require('path');
const port = process.env.PORT || 3001;

app.use(express.static('public'));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

