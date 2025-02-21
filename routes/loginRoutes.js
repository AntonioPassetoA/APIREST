const express = require('express'); // Importa o módulo 'express' para criar rotas da API.
const { loginUser } = require('../controllers/userController'); // Importa a função 'loginUser' do controller de usuários.
const loginRouter = express.Router(); // Cria uma instância de roteador para a rota de login.

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Rota para criar um usuário.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Dados do novo usuário
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
 // Rota POST para realizar login do usuário
loginRouter.post('/', (req, res) => {
  return loginUser(req, res); // Chama a função 'loginUser' para processar o login.
});

// Exporta o roteador para ser utilizado em outras partes da aplicação
module.exports = loginRouter;
