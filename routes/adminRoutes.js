const express = require('express'); // Importa o módulo Express para criar as rotas da API.
const { createAdmin, deleteUser } = require('../controllers/userController'); // Importa as funções para criar e deletar usuários.
const adminRouter = express.Router(); // Cria uma instância de roteador para a rota de admin.
const { authenticateJWT, adminOnly } = require('../middleware/authMiddleware'); // Importa os middlewares para autenticação JWT e verificação de administrador.

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
 // Rota POST para criar um novo administrador
adminRouter.post('/', [authenticateJWT, adminOnly], (req, res) => {
  return createAdmin(req, res) // Chama a função 'createAdmin' do controller de usuários para criar um administrador.
});

// Rota DELETE para excluir um usuário com base no 'username'
adminRouter.delete('/:username', [authenticateJWT, adminOnly], (req, res) => {
  return deleteUser(req, res) // Chama a função 'deleteUser' do controller de usuários para excluir o usuário.
});

// Exporta o adminRouter para ser usado em outros arquivos.
module.exports = adminRouter;
