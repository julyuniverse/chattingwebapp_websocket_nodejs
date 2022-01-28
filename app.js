const express = require('express');
const webSocket = require('./socket/webSocket');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/chatting', function (req, res) {
    res.sendFile(__dirname + '/chatting.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

webSocket();