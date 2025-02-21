// Importação de pacotes e arquivos
const express = require('express'); // Importa o módulo express para criar o servidor e as rotas.
const cors = require('cors'); // Importa o módulo cors para permitir requisições de diferentes origens.
const bodyParser = require('body-parser'); // Importa o módulo body-parser para tratar dados JSON nas requisições.
const dotenv = require('dotenv'); // Importa o módulo dotenv para carregar variáveis de ambiente.
const { errorHandler } = require('./middleware/errorHandler'); // Importa o middleware para tratamento de erros.
const swaggerJsDoc = require('swagger-jsdoc'); // Importa o módulo para gerar a documentação Swagger.
const swaggerUi = require('swagger-ui-express'); // Importa o módulo para servir a documentação Swagger como UI.


// Carregar variáveis de ambiente
dotenv.config(); // Carrega as variáveis do arquivo .env, como a chave secreta do JWT, a porta do servidor, etc.


// Configuração do servidor Express
const app = express(); // Cria uma instância do servidor Express.
app.use(cors()); // Ativa o middleware CORS, permitindo que o servidor aceite requisições de diferentes origens.
app.use(bodyParser.json()); // Ativa o middleware bodyParser para processar o corpo das requisições em formato JSON.


// Documentação Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Define a versão do OpenAPI
    info: {
      title: 'API RESTful Trabalho Back-end', // Título da API
      description: 'Documentação da API desenvolvida em Node.js com Express', // Descrição do que a API faz
      version: '1.0.0', // Versão da API
      contact: {
        name: 'Seu Nome', // Nome do desenvolvedor responsável
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL do servidor local
        description: 'Servidor Local', // Descrição do servidor
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho onde estão localizadas as rotas da API para serem documentadas pelo Swagger
};

// Geração da documentação Swagger com base nas configurações definidas acima
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rota para servir a documentação da API
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve a documentação Swagger na rota '/docs'


// Rotas do projeto
const userRoutes = require('./routes/userRoutes'); // Importa as rotas relacionadas a usuários.
const installRoutes = require('./routes/installRoutes'); // Importa as rotas para a instalação (criação de administrador inicial).
const loginRouter = require('./routes/loginRoutes'); // Importa as rotas de login.
const adminRouter = require('./routes/adminRoutes'); // Importa as rotas de administração.

// Definição das rotas
app.use('/users', userRoutes); // Registra as rotas relacionadas a usuários sob o caminho '/users'
app.use('/install', installRoutes); // Registra a rota para instalação (criação do admin inicial) sob o caminho '/install'
app.use('/login', loginRouter); // Registra as rotas de login sob o caminho '/login'
app.use('/admin', adminRouter); // Registra as rotas de administração sob o caminho '/admin'


// Middleware de tratamento de erros
app.use(errorHandler); // Adiciona o middleware para tratamento de erros, que será chamado caso ocorra algum erro nas rotas.


/**
 * Inicia o servidor na porta definida (por padrão 3000).
 * A variável PORT pode ser configurada no arquivo .env.
 */
const PORT = process.env.PORT || 3000; // Obtém a porta do arquivo .env ou usa a porta 3000 como padrão.
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); // Exibe no console a porta que o servidor está ouvindo.
  console.log(`Documentação disponível em http://localhost:${PORT}/docs`); // Exibe no console o caminho para acessar a documentação Swagger.
});
