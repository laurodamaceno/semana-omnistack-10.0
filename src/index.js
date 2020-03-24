//Importando o express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

//Criando a aplicação
const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack10@cluster0-kdgsm.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());

// Informa que nossa aplicação será capaz de interpretar JSON
app.use(express.json());

// get, post, put, delete

// Tipos de parâmetros:

// Query Params: request.query (Filtros, ordenação, paginação, ...)
// Route Params: request.params (Identificar um recurso na alteração ou remoção)
// Body: request,body (Dados para criação ou alteração de um registro)

// MongoDB (Não-relacional)

app.use(routes);


//Definindo a porta de instanciamento do app
server.listen(3333);
