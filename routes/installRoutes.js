const express = require('express'); // Importa o módulo 'express' para criar rotas da API.
const router = express.Router(); // Cria uma instância de roteador do Express.
const { installAdmin } = require('../controllers/installController'); // Importa a função 'installAdmin' do controller para criar um administrador padrão.

/**
 * @swagger
 * /install:
 *   get:
 *     summary: Cria um usuário administrador padrão
 *     description: Rota para criar o usuário administrador inicial no sistema.
 *     responses:
 *       200:
 *         description: Usuário administrador criado com sucesso.
 */
 // Rota GET para instalar um administrador padrão
router.get('/', (req, res) => {
  return installAdmin(req, res); // Chama a função 'installAdmin' para criar um administrador padrão.
});

// Exporta o roteador para ser usado em outras partes da aplicação
module.exports = router;
