const express = require('express'); // Importa o módulo 'express' para criar rotas da API.
const { registerUser, updateUser } = require('../controllers/userController'); // Importa as funções para registrar e atualizar usuários.
const userRouter = express.Router(); // Cria uma instância de roteador para a rota de usuários.
const { authenticateJWT } = require('../middleware/authMiddleware'); // Importa o middleware para autenticação JWT.

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     description: Lista todos os usuários cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 */
 // Rota GET para listar todos os usuários
userRouter.get('/', (req, res) => {
  res.json({ message: 'Lista de usuários' }); // Retorna uma mensagem genérica (pode ser melhorado para retornar os usuários reais)
});

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
 // Rota POST para registrar um novo usuário
userRouter.post('/', authenticateJWT, (req, res) => {
  return registerUser(req, res); // Chama a função 'registerUser' do controller de usuários para registrar o novo usuário.
});

// Rota PUT para atualizar dados de um usuário específico (usando o 'username' na URL)
userRouter.put('/:username', authenticateJWT, (req, res) => {
  return updateUser(req, res); // Chama a função 'updateUser' do controller de usuários para atualizar os dados do usuário.
});

// Exporta o roteador para ser utilizado em outras partes da aplicação
module.exports = userRouter;
